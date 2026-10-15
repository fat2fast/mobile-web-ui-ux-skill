const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const phase = process.argv[2];
const session = process.argv[3];
if (!['baseline', 'after'].includes(phase) || !session) {
  throw new Error('Usage: node dashboard-browser-check.cjs <baseline|after> <agent-browser-session>');
}

const output = path.join(__dirname, phase);
fs.mkdirSync(output, { recursive: true });
const url = 'http://127.0.0.1:4173';
const checks = [];

function browser(...args) {
  const raw = execFileSync('agent-browser', ['--session', session, '--json', ...args], {
    encoding: 'utf8',
  });
  const result = JSON.parse(raw);
  if (!result.success) throw new Error(`${args.join(' ')}: ${raw}`);
  return result.data?.result ?? result.data;
}

function evaluate(js) { return browser('eval', js); }
function record(name, actual, expected) {
  assert.deepEqual(actual, expected, name);
  checks.push({ name, result: 'PASS', actual });
}
function openOrders() { browser('open', `${url}/orders`); }
function visibleIds() {
  return evaluate('Array.from(document.querySelectorAll("tbody tr"), row => row.cells[1]?.innerText)');
}
function statusText() { return evaluate('document.querySelector("[role=status]")?.textContent || ""'); }

for (const width of [320, 375, 390, 430, 1280]) {
  browser('set', 'viewport', String(width), '844');
  openOrders();
  browser('screenshot', path.join(output, `dashboard-${width}.png`));
  const geometry = evaluate(`({width: innerWidth, table: document.querySelector('table')?.getBoundingClientRect().width, sidebar: document.querySelector('aside')?.getBoundingClientRect().width, main: document.querySelector('main')?.getBoundingClientRect().width, horizontalOverflow: document.documentElement.scrollWidth > innerWidth})`);
  checks.push({ name: `viewport ${width} geometry`, result: 'OBSERVED', actual: geometry });
}

browser('set', 'viewport', '390', '844');
openOrders();
browser('find', 'label', 'Search orders', 'fill', 'ORD-1001');
record('search order', visibleIds(), ['ORD-1001']);
browser('click', 'tbody tr td:nth-child(2) button');
record('detail route', evaluate('location.pathname'), '/orders/ORD-1001');
record('detail status', evaluate('document.querySelector("main")?.innerText.includes("Pending")'), true);
browser('find', 'role', 'button', 'click', '--name', 'Record follow-up');
record('detail follow-up', statusText(), 'Follow-up recorded for ORD-1001');
browser('back');
record('browser Back', evaluate('location.pathname'), '/orders');

openOrders();
browser('select', 'main label:nth-of-type(2) select', 'Shipped');
record('status filter', visibleIds(), ['ORD-1002']);
browser('download', 'main > div.mb-4 > button:nth-of-type(2)', path.join(output, 'orders-shipped.csv'));
const csv = fs.readFileSync(path.join(output, 'orders-shipped.csv'), 'utf8');
record('CSV visible rows', csv.trim(), 'id,customer,status,total\nORD-1002,Minh Tran,Shipped,$89.50');
browser('find', 'role', 'button', 'click', '--name', 'Reset filters');
record('reset filters', visibleIds(), ['ORD-1001', 'ORD-1002', 'ORD-1003', 'ORD-1004']);
browser('select', 'main label:nth-of-type(3) select', 'Customer');
record('customer sort', visibleIds(), ['ORD-1004', 'ORD-1003', 'ORD-1001', 'ORD-1002']);

if (phase === 'after') {
  for (const width of [320, 375, 390, 430]) {
    browser('set', 'viewport', String(width), '844');
    openOrders();
    if (width === 390) {
      const initial = evaluate(`(() => { const region = document.querySelector('.order-table').getBoundingClientRect(); const row = document.querySelector('tbody tr'); return { statusVisible: row.cells[2].getBoundingClientRect().right <= region.right, totalVisible: row.cells[3].getBoundingClientRect().right <= region.right }; })()`);
      record('status and total visible at 390px', initial, { statusVisible: true, totalVisible: true });
    }
    const sticky = evaluate(`(() => { const scroller = document.querySelector('.order-table'); scroller.scrollLeft = scroller.scrollWidth; const region = scroller.getBoundingClientRect(); const row = document.querySelector('tbody tr'); const select = row.cells[0].getBoundingClientRect(); const id = row.cells[1].getBoundingClientRect(); return { moved: scroller.scrollLeft > 0, pinnedSelect: Math.abs(select.left - region.left) <= 2, pinnedId: Math.abs(id.left - select.right) <= 2 }; })()`);
    record(`selection and ID pinned at ${width}px maximum scroll`, sticky, { moved: true, pinnedSelect: true, pinnedId: true });
  }
  browser('set', 'viewport', '390', '844');
}

for (const [index, id] of [[1, 'ORD-1001'], [2, 'ORD-1002'], [4, 'ORD-1004']]) {
  openOrders();
  browser('click', `tbody tr:nth-child(${index}) td:last-child button`);
  record(`row follow-up ${id}`, statusText(), `Follow-up recorded for ${id}`);
}

openOrders();
for (const id of ['ORD-1001', 'ORD-1002', 'ORD-1004']) {
  browser('check', `input[aria-label="Select ${id}"]`);
}
browser('select', 'main label:nth-of-type(2) select', 'Pending');
record('selection retained through filter', evaluate('document.querySelector("button[disabled]") === null && Array.from(document.querySelectorAll("button"), b => b.textContent).includes("Follow-up selected (3)")'), true);
browser('find', 'role', 'button', 'click', '--name', 'Follow-up selected (3)');
record('mixed status bulk follow-up', statusText(), 'Follow-up recorded for ORD-1001, ORD-1002, ORD-1004');

browser('open', `${url}/orders/ORD-1001`);
browser('find', 'role', 'button', 'click', '--name', 'Back to orders');
record('direct detail Back fallback', evaluate('location.pathname'), '/orders');

fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ phase, browser: 'agent-browser managed Chromium', viewportHeight: 844, checks }, null, 2) + '\n');
console.log(`PASS: ${phase} dashboard browser checks (${checks.filter(c => c.result === 'PASS').length} assertions, ${checks.filter(c => c.result === 'OBSERVED').length} viewport observations)`);
