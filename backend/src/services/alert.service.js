const { supabase } = require('../config/database');

exports.createAlert = async ({ userId, commodity, market, targetPrice, alertType, phoneNumber }) => {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert([{
      user_id: userId,
      commodity,
      market,
      target_price: targetPrice,
      alert_type: alertType,
      phone_number: phoneNumber
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

exports.getUserAlerts = async (userId) => {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

exports.updateAlert = async (id, userId, updates) => {
  const { data, error } = await supabase
    .from('price_alerts')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId) // ensure ownership
    .select()
    .single();
  if (error) throw error;
  return data;
};

exports.deleteAlert = async (id, userId) => {
  const { error } = await supabase.from('price_alerts').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
};