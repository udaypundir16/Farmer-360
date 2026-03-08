// CropTrade Model - represents buy/sell crop transactions
// This is a reference schema for Supabase/Postgres

module.exports = {
  cropTradeSchema: {
    id: 'UUID',
    crop: 'string', // crop name or id
    quantity: 'number', // in kg or quintal
    price_per_unit: 'number',
    total_price: 'number',
    type: 'string', // 'buy' or 'sell'
    status: 'string', // 'open', 'completed', 'cancelled'
    user_id: 'UUID', // reference to user
    created_at: 'timestamp',
    updated_at: 'timestamp',
  },
};
