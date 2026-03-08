// Alert Model - represents database schema

module.exports = {
  alertSchema: {
    id: 'UUID',
    user_id: 'UUID',
    commodity: 'string',
    market: 'string',
    target_price: 'number',
    alert_type: 'string (above/below)',
    triggered: 'boolean',
    triggered_at: 'timestamp',
    is_active: 'boolean',
    created_at: 'timestamp',
    updated_at: 'timestamp',
  },
};
