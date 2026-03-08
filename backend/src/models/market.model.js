// Market Model - represents database schema

module.exports = {
  marketSchema: {
    id: 'UUID',
    commodity: 'string',
    market: 'string',
    state: 'string',
    min_price: 'number',
    max_price: 'number',
    modal_price: 'number',
    price_date: 'date',
    created_at: 'timestamp',
  },
};
