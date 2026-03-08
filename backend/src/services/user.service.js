const { supabase } = require('../config/database');

exports.getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, phone, full_name, village, district, state, language_pref, crops_grown, latitude, longitude')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

exports.updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

exports.getNotificationPrefs = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('notification_prefs')
    .eq('id', userId)
    .single();

  if (error) return { sms: true, whatsapp: false };
  return data.notification_prefs || { sms: true, whatsapp: false };
};

exports.updateNotificationPrefs = async (userId, prefs) => {
  const { data, error } = await supabase
    .from('users')
    .update({ notification_prefs: prefs })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  // In a real app, verify old password first
  // This would require fetching the hash and comparing
  const bcrypt = require('bcryptjs');
  
  const { data: user } = await supabase
    .from('users')
    .select('password_hash')
    .eq('id', userId)
    .single();

  const isValid = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isValid) throw new Error('Current password is incorrect');

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { error } = await supabase
    .from('users')
    .update({ password_hash: hashedPassword })
    .eq('id', userId);

  if (error) throw error;
};
