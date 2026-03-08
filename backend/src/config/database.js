const { createClient } = require('@supabase/supabase-js');
const mockDatabase = require('./mockDatabase');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase;

// Check if Supabase credentials are valid (not just placeholders)
const hasValidSupabaseCredentials = 
  supabaseUrl && 
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey && 
  supabaseAnonKey.length > 20;

if (hasValidSupabaseCredentials) {
  // Use real Supabase
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✓ Using Supabase database');
} else {
  // Use mock database for development
  supabase = mockDatabase;
  console.log('⚠ Using in-memory mock database (development mode)');
}

module.exports = { supabase };

