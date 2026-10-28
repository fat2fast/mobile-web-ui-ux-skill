const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
let version = 1;
let writes = 0;
const savedDrafts = new Map();
let assetMode = 'safe';
let workerMode = 'safe';
let csrfToken = 'fixture-current';
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4187');
  const send = (status, type, body, headers = {}) => { res.writeHead(status, { 'Content-Type': type, ...headers }); res.end(body); };
  if (url.pathname === '/control/version' && req.method === 'POST') { version++; return send(200, 'text/plain', String(version)); }
  if (url.pathname === '/control/rollback' && req.method === 'POST') { const previous = Number(url.searchParams.get('version')); if (!Number.isInteger(previous) || previous < 1 || previous >= version) return send(400, 'text/plain', 'invalid version'); version = previous; return send(200, 'text/plain', String(version)); }
  if (url.pathname === '/control/assets' && req.method === 'POST') { assetMode = ['safe', 'private', 'redirect'].includes(url.searchParams.get('mode')) ? url.searchParams.get('mode') : 'safe'; return send(200, 'text/plain', assetMode); }
  if (url.pathname === '/control/worker' && req.method === 'POST') { workerMode = url.searchParams.get('mode') === 'intercept' ? 'intercept' : 'safe'; return send(200, 'text/plain', workerMode); }
  if (url.pathname === '/control/csrf' && req.method === 'POST') { csrfToken = url.searchParams.get('mode') === 'rotate' ? 'fixture-rotated' : 'fixture-current'; return send(200, 'text/plain', 'updated'); }
  if (url.pathname === '/control/writes') return send(200, 'text/plain', String(writes), { 'Cache-Control': 'no-store' });
  const draftOwner = /(?:^|;\s*)user=([AB])(?:;|$)/.exec(req.headers.cookie || '')?.[1] || 'anonymous';
  if (url.pathname === '/app/token') return send(200, 'text/plain', csrfToken, { 'Cache-Control': 'no-store' });
  if (url.pathname === '/app/saved-draft') return send(200, 'text/plain', savedDrafts.get(draftOwner) || '', { 'Cache-Control': 'no-store' });
  if (url.pathname === '/app/write' && ['POST', 'PUT'].includes(req.method)) { if (req.headers['x-csrf-token'] !== csrfToken) return send(403, 'text/plain', 'Expired form', { 'Cache-Control': 'no-store' }); let body = ''; req.on('data', chunk => { body += chunk; }); req.on('end', () => { writes++; savedDrafts.set(draftOwner, body); send(200, 'text/plain', 'saved', { 'Cache-Control': 'no-store' }); }); return; }
  if (url.pathname === '/app/sw.js') { let source = fs.readFileSync(path.join(root, 'sw.js'), 'utf8').replaceAll('__VERSION__', String(version)); if (workerMode === 'intercept') source = source.replace("if (request.method !== 'GET') return;", "if (request.method !== 'GET') { event.respondWith(new Response('fake success')); return; }"); return send(200, 'text/javascript', source, { 'Cache-Control': 'no-store' }); }
  if (url.pathname === '/app/missing.webmanifest') return send(404, 'text/plain', 'Not found');
  if (url.pathname === '/app/manifest.webmanifest') return send(200, 'application/manifest+json', JSON.stringify(url.searchParams.has('empty') ? {} : { name: 'Fixture', short_name: 'Fixture', id: '/app/', start_url: url.searchParams.has('outside') ? '/other/' : '/app/', scope: url.searchParams.has('outside') ? '/other/' : url.searchParams.has('wrong') ? '/wrong/' : '/app/', display: 'standalone', icons: [{ src: '/app/icon.svg', sizes: 'any', type: 'image/svg+xml' }] }));
  if (url.pathname === '/app/icon.svg') return send(200, 'image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#123456"/><text x="10" y="46" font-size="38" fill="white">P</text></svg>');
  if (url.pathname === '/app/offline.html') return send(200, 'text/html', '<h1>Offline</h1><p>Reconnect and retry.</p>', { 'Cache-Control': 'no-store', 'X-Fixture-Public': 'yes' });
  if (url.pathname === '/app/static.123.css') {
    if (assetMode === 'redirect') { res.writeHead(302, { Location: '/app/public.css' }); return res.end(); }
    if (assetMode === 'private') return send(200, 'text/css', 'PRIVATE-A', { 'Cache-Control': 'private, no-store' });
    return send(200, 'text/css', 'body { font-family: sans-serif; }', { 'X-Fixture-Public': 'yes' });
  }
  if (url.pathname === '/app/public.css') return send(200, 'text/css', 'body {}', { 'X-Fixture-Public': 'yes' });
  if (url.pathname === '/app/tenant-a') {
    const authorized = /(?:^|;\s*)user=A(?:;|$)/.test(req.headers.cookie || '');
    return send(authorized ? 200 : 403, 'text/plain', authorized ? 'A record' : 'Forbidden', { 'Cache-Control': 'no-store' });
  }
  if (url.pathname === '/app/private.json' || url.pathname === '/app/private') {
    const user = /(?:^|;\s*)user=([AB])(?:;|$)/.exec(req.headers.cookie || '')?.[1];
    if (!user) return send(401, 'text/plain', 'Unauthorized', { 'Cache-Control': 'no-store' });
    const body = url.pathname.endsWith('.json') ? JSON.stringify({ user, marker: `PRIVATE-${user}` }) : `<h1>PRIVATE-${user}</h1>`;
    return send(200, url.pathname.endsWith('.json') ? 'application/json' : 'text/html', body, { 'Cache-Control': url.searchParams.has('unsafe') ? 'private, max-age=3600' : 'no-store' });
  }
  if (url.pathname.startsWith('/app/')) return send(200, 'text/html', fs.readFileSync(path.join(root, 'index.html')), { 'Cache-Control': 'no-store' });
  return send(404, 'text/plain', 'Not found');
});
server.listen(4187, '127.0.0.1');
