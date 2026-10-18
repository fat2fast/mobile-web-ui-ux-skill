import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { products } from './catalog-data.js';
import './style.css';

const price = product => new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.priceMinor / 100) + ' ' + product.currency;
const illustration = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><rect width="120" height="90" rx="10" fill="#e2e8f0"/><path d="M42 30v-8h36v8" fill="none" stroke="#334155" stroke-width="5"/><rect x="25" y="30" width="70" height="44" rx="8" fill="#1d4ed8"/><rect x="38" y="43" width="24" height="12" rx="2" fill="white"/><circle cx="78" cy="50" r="7" fill="#bfdbfe"/></svg>');

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState('price');
  const [selected, setSelected] = useState([]);
  const visible = products.filter(p => `${p.id} ${p.name}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All' || p.category === category) && (!inStock || p.availability === 'In stock'))
    .sort((a,b) => (sort === 'price' ? a.priceMinor - b.priceMinor : a.name.localeCompare(b.name)) || a.id.localeCompare(b.id));
  const compared = products.filter(p => selected.includes(p.id));
  const toggle = id => setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const reset = () => { setQuery(''); setCategory('All'); setInStock(false); setSort('price'); };
  const selection = p => <label className="compare-control"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />Compare {p.id}</label>;
  const stock = p => <span className={`stock ${p.availability === 'In stock' ? 'available' : 'other'}`}>{p.availability}</span>;
  return <main>
    <header><p className="eyebrow">FIELD / HOME</p><h1>Power station catalog</h1><p>Browse capacity and compare exact prices, units and availability.</p></header>
    <section aria-label="Catalog filters" className="toolbar">
      <label>Search products<input type="search" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option>All</option><option>Portable</option><option>Backup</option></select></label>
      <label className="check-label"><input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />In stock only</label>
      <label>Sort products<select value={sort} onChange={e => setSort(e.target.value)}><option value="price">Price: low to high</option><option value="name">Name</option></select></label>
      <button id="reset-filters" onClick={reset}>Reset filters</button>
    </section>
    <p className="applied-filters">Applied: {[query && `Search: ${query}`, category !== 'All' && category, inStock && 'In stock only'].filter(Boolean).join(' · ') || 'No filters'}</p>
    <p role="status" className="catalog-summary">{visible.length} products shown · {selected.length} selected for comparison</p>
    {!visible.length && <section className="empty"><h2>No products match</h2><p>Try fewer filters. Comparison selection is retained.</p><button onClick={reset}>Show all products</button></section>}
    {!!visible.length && <>
      <div className="desktop-catalog"><table><caption>Available product information</caption><thead><tr>{['Product','Price','Capacity','Weight','Availability','Compare'].map(x => <th scope="col" key={x}>{x}</th>)}</tr></thead><tbody>{visible.map(p => <tr key={p.id} data-product-id={p.id}><th scope="row"><img width="120" height="90" src={illustration} alt={p.imageAlt} /><strong>{p.name}</strong><small>{p.id}</small></th><td>{price(p)}</td><td>{p.capacity} Wh</td><td>{p.weight} kg</td><td>{stock(p)}</td><td>{selection(p)}</td></tr>)}</tbody></table></div>
      <section className="mobile-catalog" aria-label="Products">{visible.map(p => <article key={p.id} data-product-id={p.id}><img width="120" height="90" src={illustration} alt={p.imageAlt} /><div><small>{p.id}</small><h2>{p.name}</h2><p className="price">{price(p)}</p><p>{p.capacity} Wh · {p.weight} kg</p>{stock(p)}{selection(p)}</div></article>)}</section>
    </>}
    <section className="comparison-section" aria-labelledby="comparison-heading"><h2 id="comparison-heading">Comparison ({selected.length})</h2>
      {compared.length < 2 ? <p>Select at least two products to compare. Selection survives filters.</p> : <div className="comparison-scroll" role="region" aria-label="Product comparison" tabIndex={0}><table><thead><tr><th scope="col">Attribute</th>{compared.map(p => <th scope="col" key={p.id}>{p.id}<br />{p.name}<button onClick={() => toggle(p.id)}>Remove {p.id}</button></th>)}</tr></thead><tbody>{[['Price', price],['Capacity',p => p.capacity+' Wh'],['Weight',p => p.weight+' kg'],['Availability',p => p.availability]].map(([label,value]) => <tr key={label}><th scope="row">{label}</th>{compared.map(p => <td key={p.id}>{value(p)}</td>)}</tr>)}</tbody></table></div>}
    </section>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
