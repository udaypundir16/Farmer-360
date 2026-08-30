const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

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