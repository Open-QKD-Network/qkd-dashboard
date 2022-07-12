//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/locationApi');

router.get('/fetch', API.fetchAllLocationsAsync)
router.post('/create', API.createLocationAsync)

module.exports = router;