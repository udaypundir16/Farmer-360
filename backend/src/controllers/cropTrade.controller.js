const { supabase } = require('../config/database');

// Create a new crop trade (buy/sell)
exports.createTrade = async (req, res, next) => {
  try {
    const { crop, quantity, price_per_unit, type } = req.body;
    const user_id = req.user.userId;
    if (!crop || !quantity || !price_per_unit || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const total_price = quantity * price_per_unit;
    const { data, error } = await supabase
      .from('crop_trades')
      .insert([
        { crop, quantity, price_per_unit, total_price, type, status: 'open', user_id }
      ])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ trade: data });
  } catch (error) {
    next(error);
  }
};

// Get all open trades (optionally filter by crop/type)
exports.getOpenTrades = async (req, res, next) => {
  try {
    const { crop, type } = req.query;
    let query = supabase.from('crop_trades').select('*').eq('status', 'open');
    if (crop) query = query.eq('crop', crop);
    if (type) query = query.eq('type', type);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ trades: data });
  } catch (error) {
    next(error);
  }
};

// Complete a trade (mark as completed)
exports.completeTrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    // Only allow the user who created the trade to complete it
    const { data: trade, error: fetchError } = await supabase
      .from('crop_trades')
      .select('*')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;
    if (!trade || trade.user_id !== user_id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { data, error } = await supabase
      .from('crop_trades')
      .update({ status: 'completed' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ trade: data });
  } catch (error) {
    next(error);
  }
};

// Get user's own trades
exports.getUserTrades = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { data, error } = await supabase
      .from('crop_trades')
      .select('*')
      .eq('user_id', user_id);
    if (error) throw error;
    res.json({ trades: data });
  } catch (error) {
    next(error);
  }
};
