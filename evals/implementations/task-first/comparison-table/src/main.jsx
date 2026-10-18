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
    <div className="p-3 md:p-6 max-w-6xl mx-auto">
      <header className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Cloud Hosting Plan Comparison</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          Compare specifications side-by-side with aligned metric units across all tiers.
        </p>
      </header>

      {/* Visual scroll cue on mobile */}
      <div className="scroll-cue mb-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded flex items-center justify-between md:hidden" role="note">
        <span>↔ Swipe horizontally to compare all 4 plans</span>
        <span className="font-semibold text-blue-800">4 plans available</span>
      </div>

      <div className="comparison-wrapper relative">
        <div className="overflow-x-auto comparison-scroll-container rounded-lg border border-gray-200 bg-white" role="region" tabIndex={0} aria-label="Cloud plans comparison matrix">
          <table className="comparison-table w-full border-collapse">
            <thead>
              <tr>
                <th scope="col" className="sticky-col sticky-header bg-gray-100 font-bold text-gray-800">
                  Plan Attribute
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={`plan-header px-4 py-3 text-left ${plan.featured ? 'bg-blue-50 border-t-2 border-t-blue-600' : 'bg-gray-50'}`}
                  >
                    <div className="font-bold text-sm md:text-base text-gray-900">{plan.name}</div>
                    <div className="text-xs md:text-sm font-semibold text-blue-700 mt-0.5">{plan.price}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr.key} className="hover:bg-gray-50/50">
                  <th scope="row" className="sticky-col attribute-label font-semibold text-gray-700">
                    {attr.label}
                  </th>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className={`plan-cell px-4 py-3 text-sm text-gray-800 ${plan.featured ? 'bg-blue-50/30' : ''}`}
                      tabIndex={0}
                      aria-label={`${plan.name} ${attr.label}: ${plan[attr.key]}`}
                    >
                      {plan[attr.key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="action-row border-t-2 border-gray-200">
                <th scope="row" className="sticky-col attribute-label font-semibold text-gray-700">
                  Select
                </th>
                {plans.map((plan) => (
                  <td key={plan.id} className={`plan-action px-4 py-3 ${plan.featured ? 'bg-blue-50/30' : ''}`}>
                    <button
                      className="select-plan-btn w-full px-3 py-2 text-xs md:text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
      </div>

      {selectedPlan && (
        <div role="status" className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 font-medium text-sm">
          Selected plan: {selectedPlan}
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);