const Joi = require('joi');

exports.createMarketPriceSchema = Joi.object({
  commodity: Joi.string().required(),
  market: Joi.string().required(),
  state: Joi.string().required(),
  min_price: Joi.number().required(),
  max_price: Joi.number().required(),
  modal_price: Joi.number().required(),
  price_date: Joi.date().required(),
});

exports.createAlertSchema = Joi.object({
  commodity: Joi.string().required(),
  market: Joi.string().allow(''),
  targetPrice: Joi.number().required().positive(),
  alertType: Joi.string().valid('above', 'below').required(),
});
