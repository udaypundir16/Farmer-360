const schemesService = require('../services/schemes.service');
const { createSchemeSchema, updateSchemeSchema } = require('../validations/schemes.validation');

exports.getAllSchemes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, state, search } = req.query;
    const result = await schemesService.getAllSchemes({ page, limit, category, state, search });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getSchemeNews = async (req, res, next) => {
  try {
    const news = await schemesService.getSchemeNews();
    res.json(news);
  } catch (error) {
    next(error);
  }
};

exports.getSchemeById = async (req, res, next) => {
  try {
    const scheme = await schemesService.getSchemeById(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json(scheme);
  } catch (error) {
    next(error);
  }
};

exports.createScheme = async (req, res, next) => {
  try {
    const { error } = createSchemeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const scheme = await schemesService.createScheme(req.body);
    res.status(201).json(scheme);
  } catch (error) {
    next(error);
  }
};

exports.updateScheme = async (req, res, next) => {
  try {
    const { error } = updateSchemeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const scheme = await schemesService.updateScheme(req.params.id, req.body);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json(scheme);
  } catch (error) {
    next(error);
  }
};

exports.deleteScheme = async (req, res, next) => {
  try {
    await schemesService.deleteScheme(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};