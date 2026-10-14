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

function App() {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setResult(''); setBusy(true);
    try {
      const response = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const body = await response.json();
      if (!response.ok) { setError(body.error || 'Submission failed'); return; }
      setResult(`Submitted: ${body.receipt}`);
    } catch { setError('Local server unavailable'); } finally { setBusy(false); }
  }
  return <main className="mx-auto max-w-xl p-4 pb-12"><h1 className="text-2xl font-bold">Request form</h1><p>Enter the details and submit. Reference code REJECT triggers a server error.</p>
    <form onSubmit={submit} noValidate>{fields.map(([key, label, type, autocomplete]) => <div className="my-5" key={key}><label htmlFor={key}>{label}</label><input id={key} type={type} autoComplete={autocomplete} placeholder={label} value={values[key]} onChange={(event) => setValues({ ...values, [key]: event.target.value })} /></div>)}
      {error && <p role="alert" className="text-red-800">{error}</p>}{result && <p role="status" className="text-green-800">{result}</p>}
      <div className="fixed-submit"><button className="w-full bg-blue-900 p-3 text-white" disabled={busy} type="submit">{busy ? 'Submitting…' : 'Submit request'}</button></div>
    </form></main>;
}
createRoot(document.getElementById('root')).render(<App />);
