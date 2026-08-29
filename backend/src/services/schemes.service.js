const { supabase } = require('../config/database');

exports.getAllSchemes = async ({ page = 1, limit = 10, category, state, search }) => {
  let query = supabase.from('schemes').select('*', { count: 'exact' });

  if (category && category !== 'all') {
    query = query.eq('category', category.toLowerCase());
  }

  if (state && state !== 'all') {
    // Show schemes specific to this state as well as national 'All India' schemes
    query = query.or(`state_specific.ilike.%${state}%,state_specific.eq.All India,name.ilike.%${state}%,description.ilike.%${state}%`);
  }

  if (search && search.trim()) {
    const s = search.trim();
    query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%,category.ilike.%${s}%`);
  }

  const p = parseInt(page) || 1;
  const l = parseInt(limit) || 10;
  const from = (p - 1) * l;
  const to = from + l - 1;
  query = query.range(from, to).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data,
    pagination: {
      page: p,
      limit: l,
      total: count || 0,
      pages: Math.ceil((count || 0) / l)
    }
  };
};

exports.getSchemeById = async (id) => {
  const { data, error } = await supabase.from('schemes').select('*').eq('id', id).single();
  if (error) return null;
  return data;
};

exports.createScheme = async (schemeData) => {
  const { data, error } = await supabase.from('schemes').insert([schemeData]).select().single();
  if (error) throw error;
  return data;
};

exports.updateScheme = async (id, updates) => {
  const { data, error } = await supabase.from('schemes').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};


const Parser = require('rss-parser');
const parser = new Parser();

// Simple in-memory cache for news
let newsCache = {
  data: [],
  lastFetch: 0,
  CACHE_DURATION: 60 * 60 * 1000 // 1 hour
};

exports.getSchemeNews = async () => {
  try {
    const now = Date.now();
    // Return cached data if valid
    if (newsCache.data.length > 0 && (now - newsCache.lastFetch) < newsCache.CACHE_DURATION) {
      return newsCache.data;
    }

    // Fetch fresh news
    console.log('Fetching fresh news from Google News RSS...');
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=agriculture+schemes+india&hl=en-IN&gl=IN&ceid=IN:en');

    const newsItems = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      source: item.source || 'Google News',
      contentSnippet: item.contentSnippet
    }));

    // Update cache
    newsCache = {
      data: newsItems,
      lastFetch: now,
      CACHE_DURATION: 60 * 60 * 1000
    };

    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return cached data even if expired in case of error, or empty array
    return newsCache.data.length > 0 ? newsCache.data : [];
  }
};

exports.deleteScheme = async (id) => {
  const { error } = await supabase.from('schemes').delete().eq('id', id);
  if (error) throw error;
};