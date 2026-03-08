const marketService = require('../services/market.service');

exports.getLatestPrices = async (req, res, next) => {
  try {
    const prices = await marketService.getLatestPrices(req.query);
    res.json(prices);
  } catch (error) {
    next(error);
  }
};

exports.getPriceHistory = async (req, res, next) => {
  try {
    const { commodity, market } = req.query;
    if (!commodity || !market) return res.status(400).json({ message: 'Commodity and market required' });
    const history = await marketService.getPriceHistory(commodity, market, req.query.days);
    res.json(history);
  } catch (error) {
    next(error);
  }
};

exports.getPriceTrends = async (req, res, next) => {
  try {
    const trends = await marketService.getPriceTrends(req.query);
    res.json(trends);
  } catch (error) {
    next(error);
  }
};