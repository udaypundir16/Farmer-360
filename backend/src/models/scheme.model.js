// Scheme Model - represents database schema

module.exports = {
  schemeSchema: {
    id: 'UUID',
    name: 'string',
    description: 'string',
    category: 'string',
    eligibility_criteria: 'string',
    benefits: 'string',
    application_process: 'string',
    documents_required: 'string[]',
    state_specific: 'string',
    deadline: 'date',
    official_link: 'string',
    // additional gov-specific fields
    department: 'string',
    scheme_code: 'string',
    start_date: 'date',
    funding_amount: 'string',
    implementing_agency: 'string',
    contact_info: 'string',
    last_updated: 'date',
    is_active: 'boolean',
    created_at: 'timestamp',
  },
};
