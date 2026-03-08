const Joi = require('joi');

exports.registerSchema = Joi.object({
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
    'string.pattern.base': 'Phone number must be in international format (e.g., +919876543210)'
  }),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(3).max(100).required(),
  village: Joi.string().min(2).required(),
  district: Joi.string().min(2).required(),
  state: Joi.string().min(2).required(),
  languagePref: Joi.string().valid('en', 'hi', 'ta', 'te', 'mr').default('en'),
  cropsGrown: Joi.array().items(Joi.string()).min(1).required()
});

exports.loginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required()
});