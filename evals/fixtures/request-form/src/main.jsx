import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [form, setForm] = useState({
    requestType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setReceipt('');
    try {
      const formData = new FormData();
      formData.append('requestType', form.requestType);
      formData.append('startDate', form.startDate);
      formData.append('endDate', form.endDate);
      formData.append('reason', form.reason);
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch('/api/request', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed');
      } else {
        setReceipt(data.requestId || data.receipt);
      }
    } catch {
      setError('Network failure');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto pb-24">
      <h1 className="text-2xl font-bold mb-4">Submit Workplace Request</h1>
      {error && <div role="alert" className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}
      {receipt && <div role="status" className="mb-4 p-3 bg-green-100 text-green-800 rounded font-semibold">Submitted: {receipt}</div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="requestType" className="block text-sm font-semibold mb-1">Request Type</label>
          <select
            id="requestType"
            value={form.requestType}
            onChange={(e) => setForm({ ...form, requestType: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option>Annual Leave</option>
            <option>Equipment Request</option>
            <option>Travel Authorization</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-semibold mb-1">Start Date</label>
          <input
            id="startDate"
            type="text"
            placeholder="YYYY-MM-DD"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-semibold mb-1">End Date</label>
          <input
            id="endDate"
            type="text"
            placeholder="YYYY-MM-DD"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-semibold mb-1">Reason</label>
          <textarea
            id="reason"
            rows="3"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Attachment (Drag & Drop)</label>
          <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded">
            <input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Fixed bottom footer in baseline */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex justify-end">
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded">
            Submit request
          </button>
        </div>
      </form>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);