//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/siteInformationApi');

/**
 * Routes of /api/v1/siteInformation
 */
router.get('/topology', API.fetchTopologyAsync);

module.exports = router;