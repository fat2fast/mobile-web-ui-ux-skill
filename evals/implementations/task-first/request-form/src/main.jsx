import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function isValidCalendarDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function isDateInRange(str) {
  return str >= '2026-01-01' && str <= '2027-12-31';
}

function App() {
  const [form, setForm] = useState({
    requestType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [file, setFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [receipt, setReceipt] = useState('');
  const [pendingFocus, setPendingFocus] = useState(null);
  const fileInputRef = useRef(null);
  const alertRef = useRef(null);

  useEffect(() => {
    if (!pendingFocus) return;
    const target = pendingFocus === 'global' ? alertRef.current : document.getElementById(pendingFocus);
    target?.focus();
    setPendingFocus(null);
  }, [pendingFocus, fieldErrors, serverError]);

  const updateField = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
    setServerError('');
    setReceipt('');
  };

  const updateFile = (nextFile) => {
    setFile(nextFile);
    setFieldErrors((previous) => {
      if (!previous.file) return previous;
      const next = { ...previous };
      delete next.file;
      return next;
    });
    setServerError('');
    setReceipt('');
  };

  // Calculate inclusive duration
  const computeDuration = (start, end) => {
    if (!start || !end) return null;
    if (!isValidCalendarDate(start) || !isValidCalendarDate(end)) return null;
    const d1 = new Date(start);
    const d2 = new Date(end);
    if (d2 < d1) return -1;
    return Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1;
  };

  const days = computeDuration(form.startDate, form.endDate);

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    setFieldErrors({});
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
        if (data.field) {
          setFieldErrors({ [data.field]: data.error || 'Check this field' });
          setPendingFocus(data.field);
        } else {
          setServerError(data.error || 'Submission failed');
          setPendingFocus('global');
        }
      } else {
        const id = data.requestId || data.receipt;
        setReceipt(id);
      }
    } catch {
      setServerError('Network connection failed');
      setPendingFocus('global');
    }
  };

  return (
    <div className="form-page p-3 md:p-6 max-w-xl mx-auto">
      <header className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Submit Workplace Request</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          Select request type, specify date range, and attach documentation.
        </p>
      </header>

      {serverError && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="server-alert mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm font-medium">
          {serverError}
        </div>
      )}

      {receipt && (
        <div role="status" className="receipt-banner mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded font-semibold text-sm">
          Submitted: {receipt}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4" noValidate>
        {/* Request Type */}
        <div>
          <label htmlFor="requestType" className="block text-sm font-semibold text-gray-700 mb-1">
            Request Type <span className="text-red-500">*</span>
          </label>
          <select
            id="requestType"
            value={form.requestType}
            aria-describedby={fieldErrors.requestType ? 'requestType-error' : undefined}
            aria-invalid={!!fieldErrors.requestType}
            onChange={(e) => updateField('requestType', e.target.value)}
            className="w-full border border-gray-500 p-2.5 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option>Annual Leave</option>
            <option>Equipment Request</option>
            <option>Travel Authorization</option>
          </select>
          {fieldErrors.requestType && (
            <p id="requestType-error" role="alert" className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.requestType}</p>
          )}
        </div>

        {/* Date Range: Start and End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="date-entry">
            <input
              id="startDate"
              type="text"
              placeholder="YYYY-MM-DD"
              value={form.startDate}
              aria-describedby={fieldErrors.startDate ? 'startDate-error' : 'startDate-hint'}
              aria-invalid={!!fieldErrors.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className={`w-full border p-2.5 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${fieldErrors.startDate ? 'border-red-500 bg-red-50/20' : 'border-gray-500'}`}
            />
            <input
              type="date"
              aria-label="Choose start date"
              aria-describedby={fieldErrors.startDate ? 'startDate-error' : 'startDate-hint'}
              aria-invalid={!!fieldErrors.startDate}
              min="2026-01-01"
              max="2027-12-31"
              value={isValidCalendarDate(form.startDate) ? form.startDate : ''}
              onChange={(e) => updateField('startDate', e.target.value)}
              className="date-picker border border-gray-500 rounded"
            />
            </div>
            <span id="startDate-hint" className="block text-xs text-gray-500 mt-0.5">Format: YYYY-MM-DD (2026-01-01 to 2027-12-31)</span>
            {fieldErrors.startDate && (
              <p id="startDate-error" role="alert" className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.startDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <div className="date-entry">
            <input
              id="endDate"
              type="text"
              placeholder="YYYY-MM-DD"
              value={form.endDate}
              aria-describedby={fieldErrors.endDate ? 'endDate-error' : 'endDate-hint'}
              aria-invalid={!!fieldErrors.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              className={`w-full border p-2.5 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${fieldErrors.endDate ? 'border-red-500 bg-red-50/20' : 'border-gray-500'}`}
            />
            <input
              type="date"
              aria-label="Choose end date"
              aria-describedby={fieldErrors.endDate ? 'endDate-error' : 'endDate-hint'}
              aria-invalid={!!fieldErrors.endDate}
              min="2026-01-01"
              max="2027-12-31"
              value={isValidCalendarDate(form.endDate) ? form.endDate : ''}
              onChange={(e) => updateField('endDate', e.target.value)}
              className="date-picker border border-gray-500 rounded"
            />
            </div>
            <span id="endDate-hint" className="block text-xs text-gray-500 mt-0.5">Format: YYYY-MM-DD (2026-01-01 to 2027-12-31)</span>
            {fieldErrors.endDate && (
              <p id="endDate-error" role="alert" className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.endDate}</p>
            )}
          </div>
        </div>

        {/* Derived Duration Feedback */}
        {days !== null && (
          <div>
            {days > 0 ? (
              <div role="status" className="derived-days text-xs md:text-sm text-blue-800 bg-blue-50 border border-blue-200 p-2.5 rounded flex items-center justify-between">
                <span>Calculated Duration:</span>
                <strong className="font-semibold">{days} days (inclusive)</strong>
              </div>
            ) : (
              <div role="alert" className="text-xs md:text-sm text-red-700 bg-red-50 border border-red-200 p-2.5 rounded">
                End date cannot be earlier than start date
              </div>
            )}
          </div>
        )}

        {/* Reason */}
        <div>
          <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-1">
            Reason / Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            rows="3"
            value={form.reason}
            aria-describedby={fieldErrors.reason ? 'reason-error' : undefined}
            aria-invalid={!!fieldErrors.reason}
            onChange={(e) => updateField('reason', e.target.value)}
            placeholder="Explain the purpose of your request..."
            className={`w-full border p-2.5 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${fieldErrors.reason ? 'border-red-500 bg-red-50/20' : 'border-gray-500'}`}
          />
          {fieldErrors.reason && (
            <p id="reason-error" role="alert" className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.reason}</p>
          )}
        </div>

        {/* Attachment - Mobile touch affordance */}
        <div>
          <label htmlFor="file" className="block text-sm font-semibold text-gray-700 mb-1">
            Supporting Document (Optional, PDF/PNG/JPG, max 5MB)
          </label>
          <div className="mobile-upload-container border border-gray-300 rounded p-3 bg-gray-50 flex flex-col gap-2">
            <input
              id="file"
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              aria-describedby={fieldErrors.file ? 'file-error' : 'file-hint'}
              aria-invalid={!!fieldErrors.file}
              onChange={(e) => updateFile(e.target.files[0] || null)}
              className="text-xs md:text-sm text-gray-700 cursor-pointer"
            />
            <span id="file-hint" className="text-xs text-gray-500">Allowed: .pdf, .png, .jpg (up to 5MB)</span>
            {file && (
              <div className="selected-file text-xs text-gray-700 font-medium bg-white p-1.5 rounded border border-gray-200">
                <span>Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                <button type="button" onClick={() => { if (fileInputRef.current) fileInputRef.current.value = ''; updateFile(null); }}>Remove file</button>
              </div>
            )}
          </div>
          {fieldErrors.file && (
            <p id="file-error" role="alert" className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.file}</p>
          )}
        </div>

        {/* In-flow accessible Submit CTA with verified clearance */}
        <div className="submit-container pt-3">
          <p className="text-xs text-gray-600 mb-2">Edited fields are checked again when you submit.</p>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm cursor-pointer"
          >
            Submit request
          </button>
        </div>
      </form>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);