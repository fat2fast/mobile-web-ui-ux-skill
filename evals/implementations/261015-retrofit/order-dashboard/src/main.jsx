import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const orders = [
  { id: 'ORD-1001', customer: 'Lan Nguyen', status: 'Pending', total: '$125.00', date: '2026-10-10', items: 2, channel: 'Web', city: 'Hanoi' },
  { id: 'ORD-1002', customer: 'Minh Tran', status: 'Shipped', total: '$89.50', date: '2026-10-11', items: 1, channel: 'Web', city: 'Da Nang' },
  { id: 'ORD-1003', customer: 'Hoa Pham', status: 'Pending', total: '$240.00', date: '2026-10-12', items: 4, channel: 'Partner', city: 'HCMC' },
  { id: 'ORD-1004', customer: 'An Le', status: 'Delivered', total: '$37.00', date: '2026-10-13', items: 1, channel: 'Web', city: 'Hue' },
];

function App() {
  const [path, setPath] = useState(location.pathname);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('id');
  const [selection, setSelection] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => { const onPop = () => setPath(location.pathname); addEventListener('popstate', onPop); return () => removeEventListener('popstate', onPop); }, []);
  const go = (next) => { history.pushState({ fromApp: true }, '', next); setPath(next); };
  const detailSegment = path.match(/^\/orders\/([^/]+)$/)?.[1] || '';
  let detailId = detailSegment;
  try { detailId = decodeURIComponent(detailSegment); } catch { /* Keep malformed URLs on the not-found path. */ }
  const detail = orders.find((order) => order.id === detailId);
  const visible = orders.filter((order) => `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || order.status === filter)).sort((a, b) => String(a[sort]).localeCompare(String(b[sort])));
  const act = (order) => { setMessage(`Follow-up recorded for ${order.id}`); };
  return <div className="app-shell flex min-h-screen">
    <aside><strong className="block p-4">Ops</strong><a href="/orders" onClick={(e) => { e.preventDefault(); go('/orders'); }}>Orders</a><a href="/reports" onClick={(e) => { e.preventDefault(); go('/reports'); }}>Reports</a><a href="/settings" onClick={(e) => { e.preventDefault(); go('/settings'); }}>Settings</a></aside>
    <main className="min-w-0 flex-1 p-4 md:p-8"><h1 className="mb-4 text-2xl font-bold">{detail ? detail.id : 'Orders'}</h1>
      {detail ? <div><button className="mb-4 underline" onClick={() => history.state?.fromApp ? history.back() : go('/orders')}>Back to orders</button><dl>{Object.entries(detail).map(([key, value]) => <div className="border-b py-2" key={key}><dt className="inline font-bold">{key}: </dt><dd className="inline">{value}</dd></div>)}</dl><button className="mt-4 border p-2" onClick={() => act(detail)}>Record follow-up</button></div> : detailId ? <p>Order not found. <a href="/orders">View orders</a></p> : path !== '/orders' && path !== '/' ? <p>Section: {path.slice(1)}. <button onClick={() => go('/orders')}>Open orders</button></p> : <>
        <div className="order-controls mb-4 flex flex-wrap gap-3"><label>Search orders <input className="border p-2" value={query} onChange={(e) => setQuery(e.target.value)} /></label><label>Status <select className="border p-2" value={filter} onChange={(e) => setFilter(e.target.value)}>{['All','Pending','Shipped','Delivered'].map((s) => <option key={s}>{s}</option>)}</select></label><label>Sort <select className="border p-2" value={sort} onChange={(e) => setSort(e.target.value)}><option value="id">ID</option><option value="customer">Customer</option><option value="date">Date</option></select></label><button className="border p-2" onClick={() => { setQuery(''); setFilter('All'); }}>Reset filters</button><button className="border p-2" onClick={() => { const csv = ['id,customer,status,total', ...visible.map(({id,customer,status,total}) => [id,customer,status,total].join(','))].join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'orders.csv'; link.click(); URL.revokeObjectURL(link.href); }}>Export visible</button></div>
        <p className="mobile-table-hint">Swipe the table to see all order fields and actions.</p>
        <div className="order-table overflow-x-auto" role="region" aria-label="Orders table, scroll horizontally for more columns" tabIndex="0"><table><thead><tr><th>Select</th><th>ID</th><th>Status</th><th>Total</th><th>Customer</th><th>Date</th><th>Items</th><th>Channel</th><th>City</th><th>Action</th></tr></thead><tbody>{visible.map((order) => <tr key={order.id}><td><input aria-label={`Select ${order.id}`} type="checkbox" checked={selection.includes(order.id)} onChange={(e) => setSelection(e.target.checked ? [...selection, order.id] : selection.filter((id) => id !== order.id))} /></td><td><button className="underline" onClick={() => go(`/orders/${order.id}`)}>{order.id}</button></td><td>{order.status}</td><td>{order.total}</td><td>{order.customer}</td><td>{order.date}</td><td>{order.items}</td><td>{order.channel}</td><td>{order.city}</td><td><button className="border p-1" onClick={() => act(order)}>Follow-up</button></td></tr>)}</tbody></table></div><button className="mt-4 border p-2" disabled={!selection.length} onClick={() => { setMessage(`Follow-up recorded for ${selection.join(', ')}`); setSelection([]); }}>Follow-up selected ({selection.length})</button>
      </>}{message && <p role="status" className="mt-4">{message}</p>}
    </main></div>;
}
createRoot(document.getElementById('root')).render(<App />);
