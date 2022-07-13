//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/locationApi');

/**
 * Routes of /api/v1/location
 */
router.get('/fetch', API.fetchAllLocationsAsync)
router.post('/create', API.createLocationAsync)

module.exports = router;