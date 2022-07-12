//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/topologyApi');

router.get('/fetch/:ip', API.fetchTopologyAsync)

module.exports = router;