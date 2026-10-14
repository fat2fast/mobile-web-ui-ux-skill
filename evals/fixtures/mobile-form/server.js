import { createServer } from 'node:http';

createServer(async (request, response) => {
  if (request.url !== '/api/submit' || request.method !== 'POST') {
    response.writeHead(404, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: 'Not found' })); return;
  }
  try {
    let raw = '';
    for await (const chunk of request) raw += chunk;
    const data = JSON.parse(raw);
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
    const missing = required.find((key) => !String(data[key] || '').trim());
    const error = missing ? `${missing} is required` : data.reference === 'REJECT' ? 'Reference code was rejected by server' : !/^[^@]+@[^@]+\.[^@]+$/.test(data.email) ? 'Email is invalid' : null;
    response.writeHead(error ? 422 : 200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(error ? { error } : { receipt: 'LOCAL-001' }));
  } catch { response.writeHead(400, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: 'Invalid request' })); }
}).listen(4175, '127.0.0.1');
