const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken); // all alert routes protected

router.post('/', alertController.createAlert);
router.get('/', alertController.getUserAlerts);
router.put('/:id', alertController.updateAlert);
router.delete('/:id', alertController.deleteAlert);

module.exports = router;