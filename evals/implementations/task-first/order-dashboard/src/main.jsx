import React, { useEffect, useRef, useState } from 'react';
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
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const onPop = () => setPath(location.pathname);
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  const closeMenu = () => {
    if (menuRef.current?.open) menuRef.current.close();
  };

  useEffect(() => {
    const desktop = matchMedia('(min-width: 1024px)');
    const onDesktop = () => { if (desktop.matches && menuRef.current?.open) menuRef.current.close(); };
    desktop.addEventListener('change', onDesktop);
    return () => desktop.removeEventListener('change', onDesktop);
  }, []);

  const go = (next) => {
    closeMenu();
    history.pushState({ fromApp: true }, '', next);
    setPath(next);
  };

  const detailSegment = path.match(/^\/orders\/([^/]+)$/)?.[1] || '';
  let detailId = detailSegment;
  try {
    detailId = decodeURIComponent(detailSegment);
  } catch {
    /* Keep malformed URLs on the not-found path. */
  }
  const detail = orders.find((order) => order.id === detailId);
  const visible = orders
    .filter((order) => `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || order.status === filter))
    .sort((a, b) => String(a[sort]).localeCompare(String(b[sort])));

  const act = (order) => {
    setMessage(`Follow-up recorded for ${order.id}`);
  };

  const toggleSelect = (id) => {
    setSelection((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="app-shell min-h-screen">
      <header className="mobile-header">
        <strong>Ops</strong>
        <button ref={menuButtonRef} type="button" onClick={() => menuRef.current?.showModal()} aria-label="Open navigation">Open navigation</button>
      </header>
      <dialog ref={menuRef} className="mobile-menu" aria-label="Navigation" onClose={() => menuButtonRef.current?.focus()} onClick={(event) => { if (event.target === menuRef.current) closeMenu(); }}>
        <nav aria-label="Mobile navigation">
          <button type="button" onClick={closeMenu} aria-label="Close navigation">Close</button>
          <a href="/orders" onClick={(e) => { e.preventDefault(); go('/orders'); }}>Orders</a>
          <a href="/reports" onClick={(e) => { e.preventDefault(); go('/reports'); }}>Reports</a>
          <a href="/settings" onClick={(e) => { e.preventDefault(); go('/settings'); }}>Settings</a>
        </nav>
      </dialog>
      <aside className="desktop-nav">
        <strong className="block p-4">Ops</strong>
        <a href="/orders" onClick={(e) => { e.preventDefault(); go('/orders'); }}>Orders</a>
        <a href="/reports" onClick={(e) => { e.preventDefault(); go('/reports'); }}>Reports</a>
        <a href="/settings" onClick={(e) => { e.preventDefault(); go('/settings'); }}>Settings</a>
      </aside>
      <main className="min-w-0 flex-1 p-3 lg:p-8">
        <h1 className="mb-4 text-2xl font-bold">{detail ? detail.id : 'Orders'}</h1>
        {detail ? (
          <div>
            <button className="mb-4 underline" onClick={() => history.state?.fromApp ? history.back() : go('/orders')}>
              Back to orders
            </button>
            <dl>
              {Object.entries(detail).map(([key, value]) => (
                <div className="border-b py-2" key={key}>
                  <dt className="inline font-bold">{key}: </dt>
                  <dd className="inline">{value}</dd>
                </div>
              ))}
            </dl>
            <button className="mt-4 border p-2 rounded" onClick={() => act(detail)}>
              Record follow-up
            </button>
          </div>
        ) : detailId ? (
          <p>Order not found. <a href="/orders">View orders</a></p>
        ) : path !== '/orders' && path !== '/' ? (
          <p>Section: {path.slice(1)}. <button onClick={() => go('/orders')}>Open orders</button></p>
        ) : (
          <>
            <div className="order-results-pane">
            <div className="mb-4 flex flex-wrap gap-2 md:gap-3">
              <label className="text-sm">
                Search orders{' '}
                <input className="border p-1.5 md:p-2 rounded text-sm" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
              <label className="text-sm">
                Status{' '}
                <select className="border p-1.5 md:p-2 rounded text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  {['All', 'Pending', 'Shipped', 'Delivered'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Sort{' '}
                <select className="border p-1.5 md:p-2 rounded text-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="id">ID</option>
                  <option value="customer">Customer</option>
                  <option value="date">Date</option>
                </select>
              </label>
              <button className="border p-1.5 md:p-2 rounded text-sm" onClick={() => { setQuery(''); setFilter('All'); }}>
                Reset filters
              </button>
              <button
                className="border p-1.5 md:p-2 rounded text-sm"
                onClick={() => {
                  const csv = ['id,customer,status,total', ...visible.map(({ id, customer, status, total }) => [id, customer, status, total].join(','))].join('\n');
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                  link.download = 'orders.csv';
                  link.click();
                  URL.revokeObjectURL(link.href);
                }}
              >
                Export visible
              </button>
            </div>

            <p className="result-count" role="status">{visible.length} {visible.length === 1 ? 'order' : 'orders'} shown</p>
            {visible.length === 0 && <div className="empty-results" role="status">No orders match your search and status filter. <button type="button" onClick={() => { setQuery(''); setFilter('All'); }}>Clear filters</button></div>}

            <div className="mobile-list space-y-3" role="region" aria-label="Orders list">
              {visible.map((order) => (
                <article key={order.id} className="order-card border p-3 rounded bg-white shadow-sm flex flex-col gap-2">
                  <div className="card-heading">
                    <input
                      aria-label={`Select ${order.id}`}
                      type="checkbox"
                      checked={selection.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                    />
                    <button className="order-detail underline text-blue-600 font-bold" aria-label={`Open details for ${order.id}`} onClick={() => go(`/orders/${order.id}`)}>
                      {order.id}
                    </button>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 border">
                      {order.status}
                    </span>
                  </div>
                  <div className="order-summary flex justify-between text-sm text-gray-700">
                    <span>{order.customer}</span>
                    <span className="order-total font-semibold text-gray-900">{order.total}</span>
                  </div>
                  <div className="flex justify-end pt-1 border-t">
                    <button
                      className="row-action border px-3 text-sm rounded bg-gray-50 hover:bg-gray-100"
                      onClick={() => act(order)}
                    >
                      Follow-up
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="desktop-table overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Channel</th>
                    <th>City</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <input
                          aria-label={`Select ${order.id}`}
                          type="checkbox"
                          checked={selection.includes(order.id)}
                          onChange={() => toggleSelect(order.id)}
                        />
                      </td>
                      <td>
                        <button className="underline" onClick={() => go(`/orders/${order.id}`)}>
                          {order.id}
                        </button>
                      </td>
                      <td>{order.customer}</td>
                      <td>{order.status}</td>
                      <td>{order.total}</td>
                      <td>{order.date}</td>
                      <td>{order.items}</td>
                      <td>{order.channel}</td>
                      <td>{order.city}</td>
                      <td>
                        <button className="border p-1" onClick={() => act(order)}>
                          Follow-up
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            </div>
            <div className={`bulk-actions ${selection.length ? 'has-selection' : ''}`}>
              {selection.length > 0 && <button type="button" onClick={() => setSelection([])}>Clear selection</button>}
              <button
                className="border rounded disabled:opacity-50 text-sm font-medium"
                disabled={!selection.length}
                onClick={() => {
                  setMessage(`Follow-up recorded for ${selection.join(', ')}`);
                  setSelection([]);
                }}
              >
                Follow-up selected ({selection.length})
              </button>
            </div>
          </>
        )}
        {message && <p role="status" className="mt-4 font-semibold text-green-700">{message}</p>}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
