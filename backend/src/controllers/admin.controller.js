const marketService = require('../services/market.service');
const { fetchMarketPrices } = require('../../scripts/fetchMarketPrices');
const { supabase } = require('../config/database');
// Admin endpoint to manually trigger market price fetch
exports.triggerManualFetch = async (req, res, next) => {
  try {
    console.log('[Admin] Triggering manual market price fetch...');
    await fetchMarketPrices();
    res.json({ message: 'Market price fetch triggered successfully' });
  } catch (error) {
    console.error('[Admin] Error:', error);
    res.status(500).json({ error: error.message });
  }
};
// Get latest prices from database (for testing)
exports.getStoredPrices = async (req, res, next) => {
  try {
    const data = await marketService.getLatestPrices(req.query);
    res.json({ 
      count: data.length, 
      prices: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
// Get price statistics
exports.getPriceStats = async (req, res, next) => {
  try {
    const data = await marketService.getLatestPrices({ limit: 1000 });
    
    const stats = {
      total_records: data.length,
      commodities: [...new Set(data.map(p => p.commodity))].length,
      states: [...new Set(data.map(p => p.state))].length,
      markets: [...new Set(data.map(p => p.market))].length,
      timestamp: new Date().toISOString()
    };
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// Admin: Get all crop trades
exports.getAllCropTrades = async (req, res, next) => {
  try {
    const { data: trades, error } = await supabase
      .from('crop_trades')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ trades: trades || [] });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all shipments
exports.getAllShipmentsAdmin = async (req, res, next) => {
  try {
    const { data: shipments, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ shipments: shipments || [] });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all forum posts
exports.getAllForumPosts = async (req, res, next) => {
  try {
    const { data: posts, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ posts: posts || [] });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete a crop trade post
exports.deleteCropTrade = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('crop_trades')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Crop trade post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete a shipment
exports.deleteShipment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete a forum post
exports.deleteForumPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Forum post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
