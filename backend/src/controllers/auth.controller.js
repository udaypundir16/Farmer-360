const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const { supabase } = require('../config/database');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res, next) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { phone, password, fullName, village, district, state, languagePref, cropsGrown } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingUser) return res.status(409).json({ message: 'Phone number already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data: newUser, error: dbError } = await supabase
      .from('users')
      .insert([{
        phone,
        password_hash: hashedPassword,
        full_name: fullName,
        village: village || null,
        district: district || null,
        state: state || null,
        language_pref: languagePref || 'en',
        crops_grown: cropsGrown || []
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, phone: newUser.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        phone: newUser.phone,
        fullName: newUser.full_name,
        village: newUser.village,
        district: newUser.district,
        state: newUser.state,
        cropsGrown: newUser.crops_grown,
        languagePref: newUser.language_pref,
        isAdmin: false
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { phone, password } = req.body;

    // Find user
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (dbError || !user) return res.status(401).json({ message: 'Invalid phone or password' });

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ message: 'Invalid phone or password' });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, isAdmin: user.is_admin || false },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
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

exports.googleAuth = async (req, res, next) => {
  try {
    const { credential, access_token, user: clientUser } = req.body;
    let googleUser = null;

    if (credential) {
      // Verify Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      googleUser = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };
    } else if (access_token) {
      // Fetch user profile from Google UserInfo endpoint
      const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      googleUser = {
        sub: userInfoRes.data.sub,
        email: userInfoRes.data.email,
        name: userInfoRes.data.name,
        picture: userInfoRes.data.picture
      };
    } else if (clientUser && clientUser.email) {
      googleUser = clientUser;
    } else {
      return res.status(400).json({ message: 'Google authentication credential is required' });
    }

    const googleId = googleUser.sub || googleUser.id || 'google_oauth';
    const googlePhoneKey = `google_${googleId}`;

    // Look up existing user in Supabase
    let { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', googlePhoneKey)
      .maybeSingle();

    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }

    if (!user) {
      // Create user record
      const randomPasswordHash = await bcrypt.hash(`GOOGLE_AUTH_${googleId}_${Date.now()}`, 10);
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          phone: googlePhoneKey,
          password_hash: randomPasswordHash,
          full_name: googleUser.name || googleUser.fullName || 'Farmer Member',
          language_pref: 'en',
          crops_grown: []
        }])

        .select()
        .single();

      if (insertError) throw insertError;
      user = newUser;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, isAdmin: user.is_admin || false },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone?.startsWith('google_') ? '' : user.phone,
        fullName: user.full_name,
        email: googleUser.email || '',
        picture: googleUser.picture || '',
        village: user.village || '',
        district: user.district || '',
        state: user.state || '',
        cropsGrown: user.crops_grown || [],
        languagePref: user.language_pref || 'en',
        latitude: user.latitude,
        longitude: user.longitude,
        isAdmin: user.is_admin || false
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Google authentication failed. Please try again.' });
  }
};