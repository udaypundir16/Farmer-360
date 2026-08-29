import React from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Filter } from 'lucide-react';

export default function SchemeFilters({ filters, setFilters }) {
  const { t } = useTranslation();

  const categories = [
    { key: 'subsidy', label: t('schemes.categories.subsidy', 'Subsidy') },
    { key: 'loan', label: t('schemes.categories.loan', 'Loan / Credit') },
    { key: 'insurance', label: t('schemes.categories.insurance', 'Insurance') },
    { key: 'training', label: t('schemes.categories.training', 'Tech & Training') },
    { key: 'other', label: t('schemes.categories.other', 'Other') },
  ];

  const states = [
    'All India',
    'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha',
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const handleCategorySelect = (catKey) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === catKey ? '' : catKey,
    }));
  };

  const handleStateSelect = (stateName) => {
    setFilters((prev) => ({
      ...prev,
      state: stateName === 'All India' || prev.state === stateName ? '' : stateName,
    }));
  };

  const clearAll = () => {
    setFilters({ category: '', state: '', search: '' });
  };

  const hasActiveFilters = Boolean(filters.category || filters.state || filters.search);

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-2 border-b border-primary-100/50">
          <span className="text-xs font-medium text-soil-light">Active Filters</span>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Category Pills */}
      <div>
        <h4 className="font-heading font-semibold text-sm text-soil mb-3 flex items-center gap-1.5">
          <Filter size={14} className="text-primary-600" />
          <span>Category</span>
        </h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, category: '' }))}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
              !filters.category
                ? 'bg-primary-700 text-white shadow-sm font-semibold'
                : 'text-soil hover:bg-primary-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategorySelect(cat.key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-primary-700 text-white shadow-sm font-semibold'
                    : 'text-soil hover:bg-primary-50'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* State Filter Dropdown & Quick Radios */}
      <div>
        <h4 className="font-heading font-semibold text-sm text-soil mb-3">State / Region</h4>
        <select
          value={filters.state || 'All India'}
          onChange={(e) => handleStateSelect(e.target.value)}
          className="w-full form-input-agri rounded-md border-primary-200 text-sm py-2 px-3 bg-white focus:ring-primary-500/20"
        >
          {states.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan'].map((st) => {
            const isSelected = filters.state === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => handleStateSelect(st)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-primary-700 text-white border-primary-700 font-semibold'
                    : 'bg-white text-soil-light border-primary-200 hover:border-primary-400'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

