const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'inline script exists');
new vm.Script(script);

const ids = ['contact', 'name', 'email', 'message', 'name-error', 'email-error',
  'message-error', 'email-suggestion', 'accept-suggestion', 'status'];
const nodes = Object.fromEntries(ids.map((id) => [id, {
  id, value: '', textContent: '', hidden: true, attributes: new Map(), listeners: {},
  addEventListener(type, handler) { this.listeners[type] = handler; },
  setAttribute(name, value) { this.attributes.set(name, value); },
  removeAttribute(name) { this.attributes.delete(name); },
  hasAttribute(name) { return this.attributes.has(name); },
  focus() { focused = id; },
} ]));
let focused;
vm.runInNewContext(script, { document: { getElementById: (id) => nodes[id] } });
const fire = (id, type) => nodes[id].listeners[type]({ preventDefault() {} });
const submit = () => fire('contact', 'submit');

assert.match(html, /id="name"[^>]*required/);
assert.match(html, /id="email"[^>]*required/);
assert.match(html, /id="message"[^>]*required/);
assert.match(html, /id="email"[^>]*aria-describedby="email-error email-suggestion"/);

nodes.name.value = '  Ada  ';
nodes.email.value = 'user@gmai.com';
nodes.message.value = '  Hello  ';
fire('email', 'input');
assert.equal(nodes['email-suggestion'].hidden, false);
assert.equal(nodes['accept-suggestion'].textContent, 'user@gmail.com');
submit();
assert.equal(nodes.status.textContent, 'Message ready to send.');
assert.equal(nodes.email.value, 'user@gmai.com', 'ignoring suggestion preserves valid email');

fire('accept-suggestion', 'click');
assert.equal(nodes.email.value, 'user@gmail.com');
assert.equal(nodes['email-suggestion'].hidden, true);
submit();
assert.equal(nodes.status.textContent, 'Message ready to send.');

nodes.name.value = '  ';
submit();
assert.equal(nodes.name.hasAttribute('aria-invalid'), true);
assert.equal(nodes['name-error'].hidden, false);
assert.equal(focused, 'name');
assert.equal(nodes.email.value, 'user@gmail.com');
assert.equal(nodes.message.value, '  Hello  ');

nodes.name.value = 'Ada';
fire('name', 'input');
nodes.message.value = ' ';
submit();
assert.equal(nodes.message.hasAttribute('aria-invalid'), true);
assert.equal(focused, 'message');

nodes.message.value = 'Hello';
fire('message', 'input');
nodes.email.value = 'invalid';
submit();
assert.equal(nodes.email.hasAttribute('aria-invalid'), true);
assert.equal(focused, 'email');
assert.equal(nodes['email-error'].textContent, 'Enter a valid email address.');
console.log('PASS: source markup and simulated form handlers');
