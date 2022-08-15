//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/sitesApi');

/**
 * Routes of /api/v1/location
 */
router.get('/fetch', API.fetchAllTopologiesAsync)


module.exports = router;