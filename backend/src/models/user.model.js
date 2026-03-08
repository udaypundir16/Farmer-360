// User Model - represents database schema
// Actual queries are performed using Supabase client in services

module.exports = {
  // Schema definition for reference
  userSchema: {
    id: 'UUID',
    phone: 'string (unique)',
    password_hash: 'string',
    full_name: 'string',
    village: 'string',
    district: 'string',
    state: 'string',
    language_pref: 'string',
    crops_grown: 'string[]',
    latitude: 'number',
    longitude: 'number',
    is_admin: 'boolean',
    created_at: 'timestamp',
    updated_at: 'timestamp',
  },
};
