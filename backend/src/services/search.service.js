const { supabase } = require('../config/database');

// Global search across schemes, commodities, and markets
exports.globalSearch = async (query, filters = {}) => {
  const results = { schemes: [], commodities: [], markets: [] };
  const limit = filters.limit || 10;

  // Search schemes
  const { data: schemeData } = await supabase
    .from('schemes')
    .select('id, name, description, category')
    .ilike('name', `%${query}%`)
    .limit(limit);

  results.schemes = schemeData || [];

  // Search commodities (distinct)
  const { data: commodityData } = await supabase
    .from('market_prices')
    .select('commodity')
    .ilike('commodity', `%${query}%`)
    .limit(limit);

  const uniqueCommodities = [...new Set((commodityData || []).map((d) => d.commodity))];
  results.commodities = uniqueCommodities.slice(0, limit);

  // Search markets
  const { data: marketData } = await supabase
    .from('market_prices')
    .select('market, state')
    .ilike('market', `%${query}%`)
    .limit(limit);

  results.markets = marketData || [];

  return results;
};

module.exports = exports;
