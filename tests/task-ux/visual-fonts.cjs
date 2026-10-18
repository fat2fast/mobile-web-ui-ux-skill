const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const fontFiles = [
  { file: "DejaVuSans.ttf", weight: 400, postScriptName: "DejaVuSans" },
  {
    file: "DejaVuSans-Bold.ttf",
    weight: 700,
    postScriptName: "DejaVuSans-Bold",
  },
];
const fonts = fontFiles.map((font) => ({
  ...font,
  sha256: createHash("sha256")
    .update(fs.readFileSync(path.join(__dirname, "fonts", font.file)))
    .digest("hex"),
}));
const fontIdentity = createHash("sha256")
  .update(JSON.stringify(fonts))
  .digest("hex");
const css = fontFiles
  .map(
    (font) =>
      `@font-face { font-family: Arial; font-style: normal; font-weight: ${font.weight}; src: url(data:font/ttf;base64,${fs.readFileSync(path.join(__dirname, "fonts", font.file)).toString("base64")}) format('truetype'); }`,
  )
  .join("\n");
async function installFonts(page) {
  await page.addInitScript((style) => {
    const add = () => {
      const el = document.createElement("style");
      el.textContent = style;
      document.head.append(el);
    };
    if (document.head) add();
    else document.addEventListener("DOMContentLoaded", add, { once: true });
  }, css);
}
async function usedFonts(page) {
  await page.evaluate(async () => {
    await document.fonts.load("400 16px Arial");
    await document.fonts.load("700 24px Arial");
    await document.fonts.ready;
  });
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send("DOM.enable");
    await cdp.send("CSS.enable");
    const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
    const nodes = [];
    const walk = (node) => {
      if (
        node.nodeType === 1 &&
        !["SCRIPT", "STYLE", "OPTION"].includes(node.nodeName) &&
        node.children?.some(
          (child) => child.nodeType === 3 && child.nodeValue.trim(),
        )
      )
        nodes.push(node.nodeId);
      for (const child of node.children || []) walk(child);
    };
    walk(root);
    const result = new Map();
    for (const nodeId of nodes) {
      for (const font of (
        await cdp.send("CSS.getPlatformFontsForNode", { nodeId })
      ).fonts) {
        if (!font.glyphCount) continue;
        const key =
          font.familyName + "/" + font.postScriptName + "/" + font.isCustomFont;
        const previous = result.get(key);
        result.set(key, {
          ...font,
          glyphCount: font.glyphCount + (previous?.glyphCount || 0),
        });
      }
    }
    return [...result.values()];
  } finally {
    await cdp.detach();
  }
}
module.exports = { installFonts, usedFonts, fonts, fontIdentity };
