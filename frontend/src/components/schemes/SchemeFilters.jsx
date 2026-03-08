import { useState } from 'react';

export default function SchemeFilters({ filters, setFilters }) {
  const categories = ['subsidy', 'loan', 'insurance', 'training', 'other'];
  const states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha',
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        {categories.map((cat) => (
          <label key={cat} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={filters.category === cat}
              onChange={(e) => setFilters({ ...filters, category: e.target.checked ? cat : '' })}
              className="rounded"
            />
            <span className="capitalize">{cat}</span>
          </label>
        ))}
      </div>
      <div>
        <h3 className="font-semibold mb-3">State</h3>
        {states.map((state) => (
          <label key={state} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={filters.state === state}
              onChange={(e) => setFilters({ ...filters, state: e.target.checked ? state : '' })}
              className="rounded"
            />
            <span>{state}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
