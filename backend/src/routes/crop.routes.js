const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');

router.get('/calendar', cropController.getCropCalendar);
router.get('/activities/:cropId/:month', cropController.getCropActivities);
router.get('/recommendations', cropController.getCropRecommendations);

module.exports = router;
