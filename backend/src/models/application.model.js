// Application Model - represents database schema

module.exports = {
  applicationSchema: {
    id: 'UUID',
    user_id: 'UUID',
    scheme_id: 'UUID',
    status: 'string (pending/approved/rejected)',
    application_date: 'date',
    documents: 'json',
    notes: 'string',
    created_at: 'timestamp',
    updated_at: 'timestamp',
  },
};
