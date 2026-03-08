const { supabase } = require('../config/database');

exports.getAllSchemes = async ({ page, limit, category, state, search }) => {
  let query = supabase.from('schemes').select('*', { count: 'exact' });

  if (category) query = query.eq('category', category);
  if (state) query = query.eq('state_specific', state);
  if (search) query = query.ilike('name', `%${search}%`); // or use full-text search

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
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