import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const plans = [
  { id: 'starter', name: 'Starter Plan', price: '$19 / mo', vcpu: '2 cores', ram: '4 GB', storage: '80 GB NVMe', bandwidth: '2 TB / mo', sla: '99.9%' },
  { id: 'standard', name: 'Standard Plan', price: '$49 / mo', vcpu: '4 cores', ram: '16 GB', storage: '250 GB NVMe', bandwidth: '5 TB / mo', sla: '99.95%' },
  { id: 'pro', name: 'Pro Plan', price: '$99 / mo', vcpu: '8 cores', ram: '32 GB', storage: '500 GB NVMe', bandwidth: '10 TB / mo', sla: '99.99%', featured: true },
  { id: 'enterprise', name: 'Enterprise Plan', price: '$249 / mo', vcpu: '32 cores', ram: '128 GB', storage: '2 TB NVMe', bandwidth: 'Unlimited', sla: '99.999%' },
];

const attributes = [
  { key: 'price', label: 'Monthly Price' },
  { key: 'vcpu', label: 'vCPU' },
  { key: 'ram', label: 'Memory' },
  { key: 'storage', label: 'Storage' },
  { key: 'bandwidth', label: 'Bandwidth' },
  { key: 'sla', label: 'Uptime SLA' },
];

function App() {
  const [selectedPlan, setSelectedPlan] = useState('');

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cloud Hosting Plan Comparison</h1>
        <p className="text-sm text-gray-600 mt-1">Compare technical specifications and pricing side by side.</p>
      </header>

      <div className="overflow-x-auto comparison-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col" className="attribute-col">Features</th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col" className={plan.featured ? 'featured-header' : ''}>
                  <div className="font-bold text-base">{plan.name}</div>
                  <div className="text-sm font-normal text-gray-600">{plan.price}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr) => (
              <tr key={attr.key}>
                <th scope="row" className="attribute-label">{attr.label}</th>
                {plans.map((plan) => (
                  <td key={plan.id} className="plan-cell">
                    {plan[attr.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="attribute-label">Action</th>
              {plans.map((plan) => (
                <td key={plan.id} className="plan-action-cell">
                  <button
                    className="select-btn"
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    Select {plan.name.replace(' Plan', '')}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {selectedPlan && (
        <div role="status" className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-green-800 font-medium">
          Selected plan: {selectedPlan}
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);