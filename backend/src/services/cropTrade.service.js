// Service for crop trading (buy/sell)
const { supabase } = require('../config/database');

exports.createTrade = async ({ crop, quantity, price_per_unit, type, user_id }) => {
  const total_price = quantity * price_per_unit;
  const { data, error } = await supabase
    .from('crop_trades')
    .insert([
      { crop, quantity, price_per_unit, total_price, type, status: 'open', user_id }
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
};

exports.getOpenTrades = async (filters = {}) => {
  let query = supabase.from('crop_trades').select('*').eq('status', 'open');
  if (filters.crop) query = query.eq('crop', filters.crop);
  if (filters.type) query = query.eq('type', filters.type);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

exports.completeTrade = async ({ id, user_id }) => {
  // Only allow the user who created the trade to complete it
  const { data: trade, error: fetchError } = await supabase
    .from('crop_trades')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchError) throw fetchError;
  if (!trade || trade.user_id !== user_id) {
    const err = new Error('Not authorized');
    err.status = 403;
    throw err;
  }
  const { data, error } = await supabase
    .from('crop_trades')
    .update({ status: 'completed' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

exports.getUserTrades = async (user_id) => {
  const { data, error } = await supabase
    .from('crop_trades')
    .select('*')
    .eq('user_id', user_id);
  if (error) throw error;
  return data;
};
