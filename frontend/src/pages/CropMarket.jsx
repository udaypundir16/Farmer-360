import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, TrendingUp, Filter, Plus, Loader as LoaderIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function CropMarket() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ crop: '', quantity: '', price_per_unit: '', type: 'sell' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch open trades
  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const res = await api.get('/crop-trade');
      setTrades(res?.data?.trades || []);
    } catch (err) {
      console.error(err);
      setError(t('common.error'));
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
      setError(t('auth.sign_in_existing'));
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/crop-trade', form);
      setSuccess(t('crop_market.post_success'));
      setForm({ crop: '', quantity: '', price_per_unit: '', type: 'sell' });
      fetchTrades();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-800 font-heading flex items-center gap-3">
              <ShoppingBag className="text-primary-600" size={32} />
              {t('crop_market.title')}
            </h1>
            <p className="text-soil-light mt-2">{t('crop_market.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Post Trade Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 sm:p-6 rounded-agri-xl shadow-agri border border-primary-100 static lg:sticky top-24">
              <h2 className="text-lg sm:text-xl font-bold text-soil mb-4 flex items-center gap-2">
                <Plus size={20} className="text-primary-600" />
                {t('crop_market.post_listing')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-soil-dark mb-1.5">{t('crop_market.trade_type')}</label>
                  <div className="flex bg-cream-50 p-1.5 rounded-xl border border-primary-100/70">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'sell' })}
                      className={`flex-1 py-2.5 text-sm sm:text-base font-bold rounded-lg transition-all ${form.type === 'sell'
                        ? 'bg-white text-primary-800 shadow-sm border border-primary-200'
                        : 'text-soil-light hover:text-primary-700'
                        }`}
                    >
                      {t('crop_market.selling')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'buy' })}
                      className={`flex-1 py-2.5 text-sm sm:text-base font-bold rounded-lg transition-all ${form.type === 'buy'
                        ? 'bg-white text-primary-800 shadow-sm border border-primary-200'
                        : 'text-soil-light hover:text-primary-700'
                        }`}
                    >
                      {t('crop_market.buying')}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-soil-dark mb-1.5">{t('crop_market.crop_name')}</label>
                  <input
                    name="crop"
                    value={form.crop}
                    onChange={handleChange}
                    placeholder="e.g. Wheat, Rice, Cotton, Mustard"
                    className="form-input-agri w-full px-4 py-3 rounded-xl text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-soil-dark mb-1.5">{t('crop_market.quantity')} (kg / Qtl)</label>
                    <input
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      type="number"
                      className="form-input-agri w-full px-4 py-3 rounded-xl text-sm sm:text-base"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-soil-dark mb-1.5">{t('crop_market.price_per_unit')} (₹)</label>
                    <input
                      name="price_per_unit"
                      value={form.price_per_unit}
                      onChange={handleChange}
                      placeholder="e.g. 2400"
                      type="number"
                      className="form-input-agri w-full px-4 py-3 rounded-xl text-sm sm:text-base"
                      required
                      min="1"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-100">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary py-3.5 rounded-xl text-base font-bold flex justify-center items-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] transition-all"
                >
                  {submitting ? <LoaderIcon className="animate-spin" size={20} /> : t('crop_market.post_trade')}
                </button>
              </form>
            </div>
          </div>

          {/* Trade Listings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-agri-xl shadow-agri border border-primary-100 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-primary-100/50 bg-cream-50/60 flex justify-between items-center">
                <h2 className="font-bold text-soil text-lg sm:text-xl">{t('crop_market.all_listings')}</h2>
                <span className="text-xs sm:text-sm font-bold text-primary-800 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  {trades.length} Open Listings
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-soil-light flex flex-col items-center">
                  <div className="animate-wheat-spin mb-4 text-primary-600">
                    <LoaderIcon size={36} />
                  </div>
                  <p className="text-base font-semibold">{t('common.loading')}</p>
                </div>
              ) : trades.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="bg-cream-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-400 shadow-inner">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-soil mb-1">{t('crop_market.no_listings')}</h3>
                  <p className="text-sm text-soil-light">Be the first farmer or buyer to post a trade!</p>
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW: Responsive Cards (Visible on mobile/tablet) */}
                  <div className="block md:hidden divide-y divide-primary-100/40">
                    {trades.map((trade) => (
                      <div key={trade.id} className="p-4 space-y-3 hover:bg-cream-50/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${trade.type === 'sell'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-blue-100 text-blue-900 border-blue-300'
                            }`}>
                            {trade.type === 'sell' ? t('crop_market.selling') : t('crop_market.buying')}
                          </span>
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md uppercase">
                            {trade.status || 'Active'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-extrabold text-soil-dark tracking-tight">{trade.crop}</h3>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-soil-light">
                            <div className="bg-cream-50/80 p-2 rounded-lg border border-primary-100/50">
                              <span className="text-xs text-gray-500 font-medium block">Quantity:</span>
                              <span className="font-bold text-soil text-sm">{trade.quantity} kg</span>
                            </div>
                            <div className="bg-cream-50/80 p-2 rounded-lg border border-primary-100/50">
                              <span className="text-xs text-gray-500 font-medium block">Rate:</span>
                              <span className="font-bold text-soil text-sm">₹{trade.price_per_unit}/kg</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-primary-100/40 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-gray-500 block">Total Est. Value</span>
                            <span className="text-lg font-extrabold text-primary-800">
                              ₹{trade.total_price ? trade.total_price.toLocaleString() : (trade.quantity * trade.price_per_unit).toLocaleString()}
                            </span>
                          </div>
                          {trade.user_phone && (
                            <a
                              href={`tel:${trade.user_phone}`}
                              className="px-4 py-2 rounded-lg bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Contact
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP VIEW: Data Table (Hidden on mobile) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-cream-50 text-left">
                        <tr>
                          <th className="px-6 py-3.5 text-xs font-bold text-soil-light uppercase tracking-wider">{t('crop_market.trade_type')}</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-soil-light uppercase tracking-wider">{t('crop_market.crop_name')}</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-soil-light uppercase tracking-wider">{t('crop_market.quantity')}</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-soil-light uppercase tracking-wider">{t('crop_market.price_per_unit')}</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-soil-light uppercase tracking-wider">Total Value</th>
                          <th className="px-6 py-3.5 text-xs font-bold text-soil-light uppercase tracking-wider">{t('common.status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary-100/30">
                        {trades.map((trade) => (
                          <tr key={trade.id} className="hover:bg-cream-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${trade.type === 'sell'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-blue-100 text-blue-900 border-blue-300'
                                }`}>
                                {trade.type === 'sell' ? t('crop_market.selling') : t('crop_market.buying')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-bold text-soil text-base">{trade.crop}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-soil-light font-medium">{trade.quantity} kg</td>
                            <td className="px-6 py-4 whitespace-nowrap text-soil-light font-semibold">₹{trade.price_per_unit}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-primary-800 font-extrabold text-base">
                              ₹{trade.total_price ? trade.total_price.toLocaleString() : (trade.quantity * trade.price_per_unit).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-xs font-semibold text-soil-light bg-gray-100 px-2.5 py-1 rounded-md uppercase tracking-wide">
                                {trade.status || 'Active'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
