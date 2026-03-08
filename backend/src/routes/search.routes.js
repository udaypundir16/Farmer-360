const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/global', searchController.globalSearch);
router.get('/schemes', searchController.searchSchemes);
router.get('/commodities', searchController.searchCommodities);
router.get('/markets', searchController.searchMarkets);
router.get('/suggestions', searchController.getSearchSuggestions);
router.get('/trending', searchController.getTrendingSearches);

module.exports = router;
