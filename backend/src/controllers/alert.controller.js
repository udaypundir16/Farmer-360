const alertService = require('../services/alert.service');

exports.createAlert = async (req, res, next) => {
  try {
    console.log('Creating alert with body:', req.body);
    const alert = await alertService.createAlert({ ...req.body, userId: req.user.userId });
    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
};

exports.getUserAlerts = async (req, res, next) => {
  try {
    const alerts = await alertService.getUserAlerts(req.user.userId);
    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

exports.updateAlert = async (req, res, next) => {
  try {
    const alert = await alertService.updateAlert(req.params.id, req.user.userId, req.body);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    next(error);
  }
};

exports.deleteAlert = async (req, res, next) => {
  try {
    await alertService.deleteAlert(req.params.id, req.user.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};