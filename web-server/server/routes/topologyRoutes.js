//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/toplogyApi');

router.get('/fetch', API.fetchAllPosts)

module.exports = router;