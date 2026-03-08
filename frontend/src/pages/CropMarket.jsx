import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, TrendingUp, Filter, Plus, Loader as LoaderIcon } from 'lucide-react';
import { Button } from '../components/ui/button'; // Assuming you have a button component, or I'll use standard btn classes

export default function CropMarket() {
  const { token, user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ crop: '', quantity: '', price_per_unit: '', type: 'sell' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get token from localStorage as fallback (AuthContext may not expose it)
  const authToken = token || localStorage.getItem('token');

  // Fetch open trades
  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      // Using the relative path as proxy is likely set up in vite.config.js
      // If not, we might need the full URL, but following user's pattern:
      const res = await axios.get('http://localhost:5000/api/v1/crop-trade');
      setTrades(res?.data?.trades || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load trades. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to post a trade.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        'http://localhost:5000/api/v1/crop-trade',
        form,
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      setSuccess('Trade posted successfully!');
      setForm({ crop: '', quantity: '', price_per_unit: '', type: 'sell' });
      fetchTrades();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to post trade');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading flex items-center gap-3">
              <ShoppingBag className="text-primary-600" size={32} />
              Crop Market
            </h1>
            <p className="text-soil-light mt-2">Buy and sell crops directly with other farmers and traders.</p>
          </div>
          {/* You could add filters or other controls here */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Trade Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-agri-lg shadow-agri border border-primary-100 sticky top-24">
              <h2 className="text-xl font-bold text-soil mb-4 flex items-center gap-2">
                <Plus size={20} className="text-primary-600" />
                Post a Trade
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-soil-light mb-1">Trade Type</label>
                  <div className="flex bg-cream-50 p-1 rounded-lg border border-primary-100/50">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'sell' })}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${form.type === 'sell'
                        ? 'bg-white text-primary-700 shadow-sm border border-primary-100'
                        : 'text-soil-light hover:text-primary-600'
                        }`}
                    >
                      Sell
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'buy' })}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${form.type === 'buy'
                        ? 'bg-white text-primary-700 shadow-sm border border-primary-100'
                        : 'text-soil-light hover:text-primary-600'
                        }`}
                    >
                      Buy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-soil-light mb-1">Crop Name</label>
                  <input
                    name="crop"
                    value={form.crop}
                    onChange={handleChange}
                    placeholder="e.g. Wheat, Rice, Cotton"
                    className="form-input-agri"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-soil-light mb-1">Quantity (kg)</label>
                    <input
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="0"
                      type="number"
                      className="form-input-agri"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-soil-light mb-1">Price/kg (₹)</label>
                    <input
                      name="price_per_unit"
                      value={form.price_per_unit}
                      onChange={handleChange}
                      placeholder="0"
                      type="number"
                      className="form-input-agri"
                      required
                      min="1"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary py-3 text-base flex justify-center items-center gap-2"
                >
                  {submitting ? <LoaderIcon className="animate-spin" size={20} /> : 'Post Trade'}
                </button>
              </form>
            </div>
          </div>

          {/* Trade Listings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-agri-lg shadow-agri border border-primary-100 overflow-hidden">
              <div className="p-4 border-b border-primary-100/50 bg-cream-50/50 flex justify-between items-center">
                <h2 className="font-bold text-soil text-lg">Open Market Trades</h2>
                <div className="text-sm text-soil-light">
                  {trades.length} active listings
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-soil-light flex flex-col items-center">
                  <div className="animate-wheat-spin mb-4 text-primary-400">
                    <LoaderIcon size={32} />
                  </div>
                  <p>Loading market data...</p>
                </div>
              ) : trades.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="bg-cream-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-300">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-soil mb-2">No active trades</h3>
                  <p className="text-soil-light">Be the first to post a trade in the market!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-cream-50 text-left">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-soil-light uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-xs font-semibold text-soil-light uppercase tracking-wider">Crop</th>
                        <th className="px-6 py-3 text-xs font-semibold text-soil-light uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-xs font-semibold text-soil-light uppercase tracking-wider">Price/Unit</th>
                        <th className="px-6 py-3 text-xs font-semibold text-soil-light uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-xs font-semibold text-soil-light uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100/30">
                      {trades.map((trade) => (
                        <tr key={trade.id} className="hover:bg-cream-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${trade.type === 'sell'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                              }`}>
                              {trade.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-soil">{trade.crop}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-soil-light">{trade.quantity} kg</td>
                          <td className="px-6 py-4 whitespace-nowrap text-soil-light font-medium">₹{trade.price_per_unit}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-primary-700 font-bold">₹{trade.total_price}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-soil-light bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wide">
                              {trade.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
