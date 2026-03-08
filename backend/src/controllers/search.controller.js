const { supabase } = require('../config/database');

exports.globalSearch = async (req, res, next) => {
  try {
    const { q, type, page = 1, limit = 10 } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query required' });

    let results = { schemes: [], commodities: [], markets: [] };
    const offset = (page - 1) * limit;

    if (!type || type === 'schemes') {
      const { data } = await supabase
        .from('schemes')
        .select('id, name, description, category')
        .textSearch('name', q, { config: 'english' })
        .range(offset, offset + limit - 1);
      results.schemes = data || [];
    }

    if (!type || type === 'commodities') {
      const { data } = await supabase
        .from('market_prices')
        .select('commodity')
        .ilike('commodity', `%${q}%`)
        .limit(limit);
      results.commodities = [...new Set((data || []).map(d => d.commodity))];
    }

    if (!type || type === 'markets') {
      const { data } = await supabase
        .from('market_prices')
        .select('market, state')
        .ilike('market', `%${q}%`)
        .limit(limit);
      results.markets = data || [];
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
};

exports.searchSchemes = async (req, res, next) => {
  try {
    const { q, category, state, page = 1, limit = 10 } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query required' });

    const offset = (page - 1) * limit;
    let query = supabase
      .from('schemes')
      .select('*')
      .ilike('name', `%${q}%`)
      .range(offset, offset + limit - 1);

    if (category) query = query.eq('category', category);
    if (state) query = query.eq('state', state);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ schemes: data || [], total: data?.length || 0 });
  } catch (error) {
    next(error);
  }
};

exports.searchCommodities = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query required' });

    const { data, error } = await supabase
      .from('market_prices')
      .select('commodity')
      .ilike('commodity', `%${q}%`)
      .limit(parseInt(limit));

    if (error) throw error;

    const commodities = [...new Set((data || []).map(d => d.commodity))];
    res.json({ commodities });
  } catch (error) {
    next(error);
  }
};

exports.searchMarkets = async (req, res, next) => {
  try {
    const { q, state, limit = 20 } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query required' });

    let query = supabase
      .from('market_prices')
      .select('market, state')
      .ilike('market', `%${q}%`)
      .limit(parseInt(limit));

    if (state) query = query.eq('state', state);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ markets: data || [] });
  } catch (error) {
    next(error);
  }
};

exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q, type = 'all', limit = 5 } = req.query;
    if (!q || q.length < 2) return res.json({ suggestions: [] });

    const suggestions = [];
    const searchLimit = parseInt(limit);

    if (type === 'all' || type === 'schemes') {
      const { data } = await supabase
        .from('schemes')
        .select('name')
        .ilike('name', `%${q}%`)
        .limit(searchLimit);
      if (data) suggestions.push(...data.map(s => ({ text: s.name, type: 'scheme' })));
    }

    if (type === 'all' || type === 'commodities') {
      const { data } = await supabase
        .from('market_prices')
        .select('commodity')
        .ilike('commodity', `%${q}%`)
        .limit(searchLimit);
      if (data) {
        const unique = [...new Set(data.map(d => d.commodity))];
        suggestions.push(...unique.slice(0, searchLimit).map(c => ({ text: c, type: 'commodity' })));
      }
    }

    res.json({ suggestions: suggestions.slice(0, searchLimit) });
  } catch (error) {
    next(error);
  }
};

exports.getTrendingSearches = async (req, res, next) => {
  try {
    // In a real app, this would come from analytics/logs
    // For now, return some default trending searches
    const trending = [
      { term: 'wheat', count: 150 },
      { term: 'rice', count: 120 },
      { term: 'cotton', count: 95 },
      { term: 'sugarcane', count: 80 },
      { term: 'paddy', count: 75 },
    ];

    res.json({ trending });
  } catch (error) {
    next(error);
  }
};