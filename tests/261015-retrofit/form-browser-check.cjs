const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const phase = process.argv[2];
const session = process.argv[3];
if (!['baseline', 'after'].includes(phase) || !session) {
  throw new Error('Usage: node form-browser-check.cjs <baseline|after> <agent-browser-session>');
}

const output = path.join(__dirname, `form-${phase}`);
fs.mkdirSync(output, { recursive: true });
const checks = [];
function browser(...args) {
  const raw = execFileSync('agent-browser', ['--session', session, '--json', ...args], { encoding: 'utf8' });
  const result = JSON.parse(raw);
  if (!result.success) throw new Error(`${args.join(' ')}: ${raw}`);
  return result.data?.result ?? result.data;
}
function evaluate(js) { return browser('eval', js); }
function record(name, actual, expected) {
  assert.deepEqual(actual, expected, name);
  checks.push({ name, result: 'PASS', actual });
}
function openForm() { browser('open', 'http://127.0.0.1:4174/'); }
function field(id, value) { browser('fill', `#${id}`, value); }
function submit() { browser('find', 'role', 'button', 'click', '--name', 'Submit request'); }
function apiStatuses() {
  return browser('network', 'requests').requests.filter((request) => request.method === 'POST' && request.url.includes('/api/submit')).map((request) => request.status);
}

for (const width of [320, 375, 390, 430, 1280]) {
  browser('set', 'viewport', String(width), '844');
  openForm();
  browser('screenshot', path.join(output, `form-${width}.png`));
  const geometry = evaluate(`({width: innerWidth, documentOverflow: document.documentElement.scrollWidth > innerWidth, submitPosition: getComputedStyle(document.querySelector('button[type=submit]').parentElement).position, submitBottom: document.querySelector('button[type=submit]').getBoundingClientRect().bottom, notesBottom: document.querySelector('#notes').getBoundingClientRect().bottom})`);
  checks.push({ name: `viewport ${width} geometry`, result: 'OBSERVED', actual: geometry });
}

browser('set', 'viewport', '390', '844');
openForm();
for (const [id, value] of Object.entries({ fullName: 'Test User', email: 'test@example.com', phone: '0901234567', address: '12 Main Street', city: 'Hanoi', postalCode: '10000', reference: 'REJECT', notes: 'Please call first' })) field(id, value);
browser('network', 'requests', '--clear');
submit();
browser('wait', '--text', 'Reference code was rejected by server');
record('server rejection shown', evaluate('document.body.innerText.includes("Reference code was rejected by server")'), true);
record('values retained after rejection', evaluate('({name: document.querySelector("#fullName").value, notes: document.querySelector("#notes").value})'), { name: 'Test User', notes: 'Please call first' });
record('rejection HTTP status', apiStatuses(), [422]);
field('reference', 'OK');
submit();
browser('wait', '--text', 'Submitted: LOCAL-001');
record('successful resubmission', evaluate('document.body.innerText.includes("Submitted: LOCAL-001")'), true);
record('resubmission HTTP statuses', apiStatuses(), [422, 200]);

openForm();
browser('network', 'requests', '--clear');
submit();
browser('wait', '--text', phase === 'after' ? 'Full name is required' : 'fullName is required');
record('empty required field rejected', evaluate(phase === 'after'
  ? 'document.querySelector("#fullName-error")?.textContent'
  : 'document.querySelector("[role=alert]")?.textContent'),
phase === 'after' ? 'Full name is required' : 'fullName is required');
record('missing field HTTP status', apiStatuses(), [422]);
if (phase === 'after') {
  record('focus reaches missing field', evaluate('document.activeElement?.id'), 'fullName');
  record('submit stays in document flow', evaluate('getComputedStyle(document.querySelector("button[type=submit]").parentElement).position'), 'static');

  openForm();
  for (const [id, value] of Object.entries({ fullName: 'Test User', email: 'bad@', phone: '0901234567', address: '12 Main Street', city: 'Hanoi', postalCode: '10000', reference: 'OK' })) field(id, value);
  browser('network', 'requests', '--clear');
  submit();
  browser('wait', '--text', 'Email is invalid');
  record('invalid email inline error', evaluate('document.querySelector("#email-error")?.textContent'), 'Email is invalid');
  record('invalid email focus', evaluate('document.activeElement?.id'), 'email');
  record('other values retained after email error', evaluate('document.querySelector("#fullName").value'), 'Test User');
  record('invalid email HTTP status', apiStatuses(), [422]);
  field('email', 'test@example.com');
  submit();
  browser('wait', '--text', 'Submitted: LOCAL-001');
  record('corrected email resubmits', apiStatuses(), [422, 200]);
}

fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ phase, browser: 'agent-browser managed Chromium', viewportHeight: 844, checks }, null, 2) + '\n');
console.log(`PASS: ${phase} form browser checks (${checks.filter(c => c.result === 'PASS').length} assertions, ${checks.filter(c => c.result === 'OBSERVED').length} viewport observations)`);
