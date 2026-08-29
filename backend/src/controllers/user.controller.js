const bcrypt = require('bcryptjs');
const { supabase } = require('../config/database');

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { data: user, error } = await supabase
      .from('users')
      .select('id, phone, full_name, email, village, district, state, crops_grown, language_pref, latitude, longitude, is_admin')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Format response to match frontend expectations
    res.json({
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.full_name,
        email: user.email,
        village: user.village,
        district: user.district,
        state: user.state,
        cropsGrown: user.crops_grown,
        languagePref: user.language_pref,
        latitude: user.latitude,
        longitude: user.longitude,
        isAdmin: user.is_admin || false
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { fullName, email, village, district, state, cropsGrown, languagePref } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        email,
        village,
        district,
        state,
        crops_grown: cropsGrown,
        language_pref: languagePref,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // Format response to match frontend expectations
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.full_name,
        email: user.email,
        village: user.village,
        district: user.district,
        state: user.state,
        cropsGrown: user.crops_grown,
        languagePref: user.language_pref,
        latitude: user.latitude,
        longitude: user.longitude
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', userId);

    if (updateError) throw updateError;

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getNotificationPreferences = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { data: prefs, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json(prefs || {
      sms: true,
      whatsapp: false,
      email: true,
      push: false
    });
  } catch (error) {
    next(error);
  }
};

exports.updateNotificationPreferences = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { sms, whatsapp, email, push } = req.body;

    const { data: prefs, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        sms,
        whatsapp,
        email,
        push,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Notification preferences updated',
      preferences: prefs
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserApplications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { data: applications, error } = await supabase
      .from('scheme_applications')
      .select('*, schemes(name, code, category, benefits)')
      .eq('user_id', userId)
      .order('applied_date', { ascending: false });

    if (error) throw error;

    res.json(applications.map(app => ({
      id: app.id,
      scheme_name: app.schemes?.name,
      scheme_code: app.schemes?.code,
      category: app.schemes?.category,
      status: app.status,
      applied_date: app.applied_date,
      amount: app.requested_amount,
      district: app.district,
      remarks: app.remarks
    })));
  } catch (error) {
    next(error);
  }
};

exports.getUserAlerts = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { data: alerts, error } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { password } = req.body;

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) throw deleteError;

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};
