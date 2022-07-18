//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/locationApi');

/**
 * Routes of /api/v1/location
 */
router.get('/fetch', API.fetchAllLocationsAsync)
router.get('/fetch/id/:id', API.fetchIdLocationAsync)
router.get('/fetch/city/:city', API.fetchCityLocationAsync)
router.post('/create', API.createLocationAsync)
router.patch('/update/:id', API.updateLocationAsync)
router.delete('/delete/:id', API.deleteLocationAsync)

module.exports = router;