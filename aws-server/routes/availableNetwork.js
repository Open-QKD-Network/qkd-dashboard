//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/availableNetworkApi');

/**
 * Routes of /api/v1/siteInformation
 */
router.get('/isAvailable', API.fetchTopologyAsync);

module.exports = router;