import { createServer } from 'node:http';
import { createHash } from 'node:crypto';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4180;

function isValidCalendarDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function isDateInRange(str) {
  return str >= '2026-01-01' && str <= '2027-12-31';
}

const ALLOWED_EXTS = ['.pdf', '.png', '.jpg', '.jpeg'];

createServer(async (request, response) => {
  if (request.url !== '/api/request' || request.method !== 'POST') {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  try {
    let data = {};
    let fileObj = null;

    const contentType = request.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      const webReq = new Request(`http://127.0.0.1:${port}${request.url}`, {
        method: request.method,
        headers: request.headers,
        body: request,
        duplex: 'half',
      });
      const formData = await webReq.formData();
      data.requestType = formData.get('requestType')?.toString() || '';
      data.startDate = formData.get('startDate')?.toString() || '';
      data.endDate = formData.get('endDate')?.toString() || '';
      data.reason = formData.get('reason')?.toString() || '';

      const uploaded = formData.get('file');
      if (uploaded && typeof uploaded === 'object' && uploaded.name && uploaded.size > 0) {
        const content = Buffer.from(await uploaded.arrayBuffer());
        fileObj = {
          name: uploaded.name,
          size: uploaded.size,
          type: uploaded.type,
          bytes: content.byteLength,
          sha256: createHash('sha256').update(content).digest('hex'),
        };
      }
    } else {
      let raw = '';
      for await (const chunk of request) raw += chunk;
      data = JSON.parse(raw);
    }

    const sendError = (field, error) => {
      response.writeHead(422, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error, field }));
    };

    if (!data.requestType?.trim()) {
      return sendError('requestType', 'Request type is required');
    }
    if (!data.startDate?.trim()) {
      return sendError('startDate', 'Start date is required');
    }
    if (!isValidCalendarDate(data.startDate)) {
      return sendError('startDate', 'Start date is not a valid calendar date');
    }
    if (!isDateInRange(data.startDate)) {
      return sendError('startDate', 'Start date must be between 2026-01-01 and 2027-12-31');
    }
    if (!data.endDate?.trim()) {
      return sendError('endDate', 'End date is required');
    }
    if (!isValidCalendarDate(data.endDate)) {
      return sendError('endDate', 'End date is not a valid calendar date');
    }
    if (!isDateInRange(data.endDate)) {
      return sendError('endDate', 'End date must be between 2026-01-01 and 2027-12-31');
    }
    if (data.startDate > data.endDate) {
      return sendError('endDate', 'End date cannot be earlier than start date');
    }
    if (!data.reason?.trim()) {
      return sendError('reason', 'Reason is required');
    }
    if (data.reason.trim() === 'REJECT') {
      return sendError('reason', 'Request reason rejected by business policy');
    }

    if (data.fileName || data.fileSize || data.fileContent) {
      return sendError('file', 'Attachments require multipart file content');
    }

    if (fileObj) {
      const ext = (fileObj.name.substring(fileObj.name.lastIndexOf('.')) || '').toLowerCase();
      if (!ALLOWED_EXTS.includes(ext)) {
        return sendError('file', 'Unsupported file type. Allowed formats: PDF, PNG, JPG');
      }
      if (fileObj.size > 5242880) {
        return sendError('file', 'File exceeds 5MB limit');
      }
    }

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      status: 'ok',
      requestId: 'REQ-2026-001',
      receipt: 'REQ-2026-001',
      fileReceived: Boolean(fileObj),
      fileName: fileObj?.name || null,
      bytesReceived: fileObj?.bytes || 0,
      fileSha256: fileObj?.sha256 || null,
    }));
  } catch (err) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Invalid request: ' + (err.message || '') }));
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Baseline Request API listening on http://127.0.0.1:${port}`);
});