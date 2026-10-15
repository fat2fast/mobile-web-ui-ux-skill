import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const fields = [
  ['fullName', 'Full name', 'text', 'name'],
  ['email', 'Email', 'email', 'email'],
  ['phone', 'Phone', 'tel', 'tel'],
  ['address', 'Street address', 'text', 'street-address'],
  ['city', 'City', 'text', 'address-level2'],
  ['postalCode', 'Postal code', 'text', 'postal-code'],
  ['reference', 'Reference code', 'text', 'off'],
  ['notes', 'Notes', 'text', 'off'],
];
const initial = Object.fromEntries(fields.map(([key]) => [key, '']));
const requiredFields = new Set(['fullName', 'email', 'phone', 'address', 'city', 'postalCode']);
const fieldLabels = Object.fromEntries(fields.map(([key, label]) => [key, label]));

function App() {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState({});
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setFieldError({}); setResult(''); setBusy(true);
    try {
      const response = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const body = await response.json();
      if (!response.ok) {
        const message = body.error || 'Submission failed';
        const missing = message.match(/^([a-zA-Z]+) is required$/)?.[1];
        const affected = missing && requiredFields.has(missing) ? missing
          : message === 'Email is invalid' ? 'email'
          : message === 'Reference code was rejected by server' ? 'reference' : null;
        if (affected) {
          setFieldError({ [affected]: missing ? `${fieldLabels[affected]} is required` : message });
          document.getElementById(affected)?.focus();
        } else setError(message);
        return;
      }
      setResult(`Submitted: ${body.receipt}`);
    } catch { setError('Local server unavailable'); } finally { setBusy(false); }
  }
  return <main className="mx-auto max-w-xl p-4 pb-12"><h1 className="text-2xl font-bold">Request form</h1><p>Enter the details and submit. Reference code REJECT triggers a server error.</p><p>Fields marked * are required.</p>
    <form onSubmit={submit} noValidate>{fields.map(([key, label, type, autocomplete]) => <div className="my-5" key={key}><label htmlFor={key}>{label}{requiredFields.has(key) && ' *'}</label>{key === 'notes' ? <textarea id={key} autoComplete={autocomplete} placeholder={label} value={values[key]} onChange={(event) => setValues({ ...values, [key]: event.target.value })} /> : <input id={key} type={type} autoComplete={autocomplete} placeholder={label} required={requiredFields.has(key)} aria-invalid={fieldError[key] ? true : undefined} aria-describedby={fieldError[key] ? `${key}-error` : undefined} value={values[key]} onChange={(event) => { setValues({ ...values, [key]: event.target.value }); setFieldError((current) => ({ ...current, [key]: undefined })); }} />}{fieldError[key] && <p id={`${key}-error`} role="alert" className="field-error">{fieldError[key]}</p>}</div>)}
      {error && <p role="alert" className="text-red-800">{error}</p>}{result && <p role="status" className="text-green-800">{result}</p>}
      <div className="submit-area"><button className="w-full bg-blue-900 p-3 text-white" disabled={busy} type="submit">{busy ? 'Submitting…' : 'Submit request'}</button></div>
    </form></main>;
}
createRoot(document.getElementById('root')).render(<App />);
