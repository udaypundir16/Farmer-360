const { supabase } = require('../config/database');
const cache = require('../utils/cache');

// Get latest market prices with optional filters
exports.getLatestPrices = async (filters = {}) => {
  let query = supabase.from('market_prices').select('*');

  if (filters.commodity) {
    query = query.ilike('commodity', `%${filters.commodity}%`);
  }
  if (filters.state) {
    query = query.eq('state', filters.state);
  }
  if (filters.market) {
    query = query.ilike('market', `%${filters.market}%`);
  }

  const limit = filters.limit || 200;
  query = query.limit(limit).order('price_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  return data;
};

// Get price history for a specific commodity and market
exports.getPriceHistory = async (commodity, market, days = 30) => {
  const cacheKey = `price_history_${commodity}_${market}_${days}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('market_prices')
    .select('*')
    .eq('commodity', commodity)
    .eq('market', market)
    .gte('price_date', startDate.toISOString().split('T')[0])
    .order('price_date', { ascending: true });

  if (error) throw error;

  await cache.set(cacheKey, data, 3600); // Cache for 1 hour
  return data;
};

// Get price trends
exports.getPriceTrends = async (filters = {}) => {
  const { data, error } = await supabase
    .from('market_prices')
    .select('*')
    .order('commodity', { ascending: true })
    .order('price_date', { ascending: false });

  if (error) throw error;

  // Group by commodity and get latest + trends
  const trends = {};
  
  data.forEach((item) => {
    if (!trends[item.commodity]) {
      trends[item.commodity] = {
        commodity: item.commodity,
        prices: [],
        markets: new Set()
      };
    }
    trends[item.commodity].prices.push(item);
    trends[item.commodity].markets.add(item.market);
  });

  return Object.keys(trends).map((commodity) => {
    const priceData = trends[commodity];
    const prices = priceData.prices;
    const latest = prices[0] || {};
    const oldest = prices[prices.length - 1] || {};
    
    // Calculate average, min, max across all markets
    const allPrices = prices.map(p => p.modal_price);
    const avgPrice = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    
    // Calculate trend
    const change = (latest.modal_price || 0) - (oldest.modal_price || 0);
    const percentChange = oldest.modal_price ? ((change / oldest.modal_price) * 100).toFixed(2) : 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

    return {
      commodity,
      latest_price: latest.modal_price || 0,
      average_price: avgPrice,
      min_price: minPrice,
      max_price: maxPrice,
      change,
      percentChange,
      trend,
      markets_count: priceData.markets.size,
      latest_date: latest.price_date || new Date().toISOString().split('T')[0],
      price_history_points: prices.length
    };
  });
};

module.exports = exports;