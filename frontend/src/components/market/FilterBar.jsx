import { Search } from 'lucide-react';

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-agri-lg glass border border-primary-100/50 w-full">
      <div className="w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500" size={18} />
          <input
            type="text"
            name="commodity"
            placeholder="Search commodity..."
            value={filters.commodity}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 form-input-agri rounded-xl border border-primary-200 focus:ring-primary-500/20 text-sm"
          />
        </div>
      </div>
      <select
        name="state"
        value={filters.state}
        onChange={handleChange}
        className="form-input-agri rounded-xl px-4 py-2.5 w-full border border-primary-200 text-sm cursor-pointer"
      >
        <option value="">All States</option>
        <option value="Andhra Pradesh">Andhra Pradesh</option>
        <option value="Assam">Assam</option>
        <option value="Bihar">Bihar</option>
        <option value="Gujarat">Gujarat</option>
        <option value="Haryana">Haryana</option>
        <option value="Karnataka">Karnataka</option>
        <option value="Kerala">Kerala</option>
        <option value="Madhya Pradesh">Madhya Pradesh</option>
        <option value="Maharashtra">Maharashtra</option>
        <option value="Odisha">Odisha</option>
        <option value="Punjab">Punjab</option>
        <option value="Rajasthan">Rajasthan</option>
        <option value="Tamil Nadu">Tamil Nadu</option>
        <option value="Telangana">Telangana</option>
        <option value="Uttar Pradesh">Uttar Pradesh</option>
        <option value="West Bengal">West Bengal</option>
      </select>
      <input
        type="text"
        name="market"
        placeholder="Filter by Mandi / Market..."
        value={filters.market}
        onChange={handleChange}
        className="form-input-agri rounded-xl px-4 py-2.5 w-full border border-primary-200 text-sm"
      />
    </div>
  );
}

