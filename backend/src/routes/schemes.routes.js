const express = require('express');
const router = express.Router();
const schemesController = require('../controllers/schemes.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware'); // optional

// Public routes
router.get('/news', schemesController.getSchemeNews);
router.get('/', schemesController.getAllSchemes);
router.get('/:id', schemesController.getSchemeById);

// Admin routes (protected)
router.post('/', verifyToken, isAdmin, schemesController.createScheme);
router.put('/:id', verifyToken, isAdmin, schemesController.updateScheme);
router.delete('/:id', verifyToken, isAdmin, schemesController.deleteScheme);

module.exports = router;