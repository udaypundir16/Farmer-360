const Joi = require('joi');

exports.createSchemeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  category: Joi.string().valid('subsidy', 'loan', 'insurance', 'training', 'other').required(),
  eligibility_criteria: Joi.string().allow(''),
  benefits: Joi.string().allow(''),
  application_process: Joi.string().allow(''),
  documents_required: Joi.array().items(Joi.string()),
  state_specific: Joi.string().allow(''),
  deadline: Joi.date().allow(null),
  official_link: Joi.string().uri().allow(''),
  // government-specific metadata
  department: Joi.string().allow(''),
  scheme_code: Joi.string().allow(''),
  start_date: Joi.date().allow(null),
  funding_amount: Joi.string().allow(''),
  implementing_agency: Joi.string().allow(''),
  contact_info: Joi.string().allow(''),
  last_updated: Joi.date().allow(null),
  is_active: Joi.boolean().default(true)
});

exports.updateSchemeSchema = exports.createSchemeSchema.fork(
  ['name', 'category'], // make optional for update
  (schema) => schema.optional()
);