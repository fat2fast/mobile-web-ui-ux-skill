const { expect } = require('@playwright/test');

function pngPixel(png) {
  if (png.readUInt32BE(16) !== 1 || png.readUInt32BE(20) !== 1 || png[24] !== 8 || ![2, 6].includes(png[25])) throw new Error('Unsupported screenshot pixel encoding');
  const chunks = [];
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    if (png.toString('ascii', offset + 4, offset + 8) === 'IDAT') chunks.push(png.subarray(offset + 8, offset + 8 + length));
    offset += length + 12;
  }
  const scanline = require('node:zlib').inflateSync(Buffer.concat(chunks));
  if (scanline.length !== (png[25] === 2 ? 4 : 5) || scanline[0] > 4) throw new Error('Unsupported screenshot scanline');
  return [...scanline.subarray(1, 4)];
}

function luminance(rgb) {
  const linear = rgb.slice(0, 3).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

function composite(front, back) {
  const alpha = front[3] + back[3] * (1 - front[3]);
  return [...front.slice(0, 3).map((v, i) => alpha ? (v * front[3] + back[i] * back[3] * (1 - front[3])) / alpha : 0), alpha];
}

function textThreshold(size, weight) {
  return size >= 24 || (size >= 14 * 96 / 72 && weight >= 700) ? 3 : 4.5;
}

// Resolve only solid, ordinary paint stacks. Unknown painting fails closed.
async function renderedPair(locator, kind = 'text') {
  return locator.evaluate((element, kind) => {
    const conversions = [];
    function color(raw) {
      if (/^rgba?\(/.test(raw)) {
        const parts = raw.slice(raw.indexOf('(') + 1, -1).split(',').map(Number);
        if (![3, 4].includes(parts.length)) throw new Error(`Unsupported RGB serialization: ${raw}`);
        const rgba = [...parts.slice(0, 3).map(v => v / 255), parts[3] ?? 1];
        if (rgba.some(v => !Number.isFinite(v) || v < 0 || v > 1)) throw new Error(`Invalid RGB: ${raw}`);
        return rgba;
      }
      const alphaPart = raw.match(/\/\s*([\d.]+)\s*\)$/);
      if (raw.includes('/') && !alphaPart) throw new Error(`Unsupported alpha: ${raw}`);
      const alpha = alphaPart ? Number(alphaPart[1]) : 1;
      const probe = document.createElement('span');
      const declaration = `color(from ${raw} srgb r g b / 1)`;
      if (!CSS.supports('color', declaration)) throw new Error(`Unsupported color conversion: ${raw}`);
      probe.style.color = declaration;
      document.body.append(probe);
      const converted = getComputedStyle(probe).color;
      probe.remove();
      if (!converted.startsWith('color(srgb ')) throw new Error(`Unresolved color: ${raw}`);
      const values = converted.slice(11, -1).replace('/', ' ').trim().split(/\s+/).map(Number);
      const rgba = [...values.slice(0, 3), alpha];
      if (rgba.some(v => !Number.isFinite(v))) throw new Error(`Invalid color: ${raw}`);
      if (rgba.some(v => v < 0 || v > 1)) {
        if (alpha !== 1) throw new Error(`Unsupported translucent gamut mapping: ${raw}`);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d', { colorSpace: 'srgb' });
        context.fillStyle = raw;
        context.fillRect(0, 0, 1, 1);
        const bytes = [...context.getImageData(0, 0, 1, 1).data];
        conversions.push({ raw, mapped: bytes, method: 'Chromium Canvas sRGB raster', precision: '8-bit; conservative quantization interval' });
        return bytes.map(v => v / 255);
      }
      return rgba;
    }
    const over = (f, b) => {
      const a = f[3] + b[3] * (1 - f[3]);
      return [...f.slice(0, 3).map((v, i) => a ? (v * f[3] + b[i] * b[3] * (1 - f[3])) / a : 0), a];
    };
    const fade = (c, opacity) => [...c.slice(0, 3), c[3] * opacity];
    try {
      const own = getComputedStyle(element);
      let indicator = own.outlineColor;
      let extent = parseFloat(own.outlineWidth) + parseFloat(own.outlineOffset);
      let ringSample;
      if (kind === 'focus' && (own.outlineStyle === 'none' || parseFloat(own.outlineWidth) <= 0)) {
        const shadows = [];
        let depth = 0, start = 0;
        for (let i = 0; i <= own.boxShadow.length; i++) {
          if (own.boxShadow[i] === '(') depth++;
          if (own.boxShadow[i] === ')') depth--;
          if (i === own.boxShadow.length || (own.boxShadow[i] === ',' && depth === 0)) {
            shadows.push(own.boxShadow.slice(start, i).trim());
            start = i + 1;
          }
        }
        const visible = [];
        for (const shadow of shadows) {
          if (shadow === 'none') continue;
          const match = shadow.match(/^(.*?)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px\s+(-?[\d.]+)px$/);
          if (!match) throw new Error('Unresolved focus shadow geometry');
          if (color(match[1])[3] === 0) continue;
          if (Number(match[2]) !== 0 || Number(match[3]) !== 0 || Number(match[4]) !== 0 || Number(match[5]) <= 0) throw new Error('Unsupported focus shadow');
          visible.push({ color: match[1], spread: Number(match[5]) });
        }
        if (visible.length !== 1) throw new Error('Unresolved multiple focus rings');
        indicator = visible[0].color;
        extent = visible[0].spread;
        const rect = element.getBoundingClientRect();
        ringSample = { x: Math.floor(rect.left + rect.width / 2), y: Math.floor(rect.top - extent / 2) };
      }
      let foreground = color(kind === 'border' ? own.borderTopColor : kind === 'focus' ? indicator : own.color);
      let background = [0, 0, 0, 0];
      const layers = [];
      // Focus checks support outside outlines only; inner/ring/shadow needs its own renderer.
      if (kind === 'border' && (own.borderTopStyle === 'none' || parseFloat(own.borderTopWidth) <= 0)) throw new Error('No visible border');
      if (kind === 'focus' && !ringSample && (own.outlineStyle === 'none' || parseFloat(own.outlineWidth) <= 0 || parseFloat(own.outlineOffset) <= 0)) {
        throw new Error('No supported visible outside focus outline');
      }
      if (kind === 'focus') {
        const r = element.getBoundingClientRect();
        if (r.left - extent < 0 || r.top - extent < 0 || r.right + extent > innerWidth || r.bottom + extent > innerHeight) throw new Error('Focus indicator clipped by viewport');
        for (let node = element.parentElement; node; node = node.parentElement) {
          const s = getComputedStyle(node), bounds = node.getBoundingClientRect();
          if ((s.overflowX !== 'visible' && (r.left - extent < bounds.left || r.right + extent > bounds.right)) || (s.overflowY !== 'visible' && (r.top - extent < bounds.top || r.bottom + extent > bounds.bottom))) throw new Error('Focus indicator may be clipped by ancestor');
        }
      }
      for (let node = element; node; node = node.parentElement) {
        const s = getComputedStyle(node);
        if (s.backgroundImage !== 'none' || s.mixBlendMode !== 'normal' || s.filter !== 'none' || s.backdropFilter !== 'none' || s.isolation === 'isolate' || s.maskImage !== 'none') {
          throw new Error(`Complex painting at ${node.tagName}`);
        }
        for (const pseudo of ['::before', '::after']) {
          const ps = getComputedStyle(node, pseudo);
          if (ps.content !== 'none' && ps.content !== 'normal') throw new Error('Pseudo-element painting needs review');
        }
        const bg = color(s.backgroundColor);
        if (conversions.length && Number(s.opacity) !== 1) throw new Error('Gamut mapping with group opacity needs review');
        // An external outline touches the parent's surface, not the control's fill.
        const surface = node === element && kind === 'focus' ? [0, 0, 0, 0] : bg;
        foreground = fade(over(foreground, surface), Number(s.opacity));
        background = fade(over(background, surface), Number(s.opacity));
        layers.push({ tag: node.tagName, color: s.backgroundColor, opacity: s.opacity });
      }
      if (foreground[3] < 1 || background[3] < 1) {
        // Only ordinary top-level Chromium documents are covered by this canvas model.
        const root = getComputedStyle(document.documentElement);
        const body = getComputedStyle(document.body);
        if (window.top !== window || matchMedia('(forced-colors: active)').matches || root.colorScheme !== 'normal' || root.opacity !== '1' || body.opacity !== '1' || color(root.backgroundColor)[3] !== 0 || color(body.backgroundColor)[3] !== 0) throw new Error('Unsupported canvas propagation/context');
        const probe = document.createElement('span');
        probe.style.backgroundColor = 'Canvas';
        document.documentElement.append(probe);
        const canvasColor = getComputedStyle(probe).backgroundColor;
        probe.remove();
        const canvas = color(canvasColor);
        if (canvas[3] !== 1) throw new Error('Canvas system color unresolved');
        foreground = over(foreground, canvas);
        background = over(background, canvas);
        layers.push({ tag: 'browser-canvas', color: canvasColor, source: 'computed Canvas system color; top-level Chromium reference-tested' });
      }
      return { disposition: 'measured', foreground, background, layers, conversions, ringSample, fontSize: parseFloat(own.fontSize), fontWeight: Number(own.fontWeight), outlineWidth: parseFloat(own.outlineWidth) };
    } catch (error) {
      return { disposition: 'review required', reason: error.message };
    }
  }, kind);
}

async function measure(locator, kind = 'text') {
  await expect(locator).toBeVisible();
  const pair = await renderedPair(locator, kind);
  if (pair.disposition !== 'measured') return pair;
  const threshold = kind === 'text' ? textThreshold(pair.fontSize, pair.fontWeight) : 3;
  const ratio = contrast(pair.foreground, pair.background);
  if (pair.ringSample) {
    const pixel = pngPixel(await locator.page().screenshot({ clip: { ...pair.ringSample, width: 1, height: 1 } }));
    if (!pixel.every((v, i) => Math.abs(v - pair.foreground[i] * 255) <= 1)) return { disposition: 'review required', reason: 'Rendered focus edge does not match resolved ring (overlap/clipping)', pixel, ...pair, disposition: 'review required' };
    pair.ringPixel = pixel;
  }
  if (pair.conversions.length) {
    const delta = 0.5 / 255;
    const range = c => [luminance(c.map(v => Math.max(0, v - delta))), luminance(c.map(v => Math.min(1, v + delta)))];
    const [f, b] = [range(pair.foreground.slice(0, 3)), range(pair.background.slice(0, 3))];
    const lowerBound = f[0] > b[1] ? (f[0] + 0.05) / (b[1] + 0.05) : b[0] > f[1] ? (b[0] + 0.05) / (f[1] + 0.05) : 1;
    pair.quantizationLowerBound = lowerBound;
    if (ratio >= threshold && lowerBound < threshold) return { ...pair, ratio, threshold, disposition: 'review required', reason: 'Threshold-adjacent raster quantization uncertainty' };
  }
  return { ...pair, kind, ratio, threshold, disposition: ratio >= threshold ? 'PASS' : 'FAIL' };
}

async function keyboardFocus(page, locator) {
  // Start from the document rather than programmatic focus, preserving :focus-visible.
  await page.mouse.click(1, 1);
  for (let i = 0; i < 100; i++) {
    await page.keyboard.press('Tab');
    if (await locator.evaluate(el => el === document.activeElement)) {
      await expect(locator).toBeFocused();
      expect(await locator.evaluate(el => el.matches(':focus-visible'))).toBe(true);
      return;
    }
  }
  throw new Error('Target not reached through keyboard traversal');
}

module.exports = { luminance, contrast, composite, textThreshold, renderedPair, measure, keyboardFocus, pngPixel };
