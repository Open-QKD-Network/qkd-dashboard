//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/ipInfoApi');

/**
 * Routes of /api/v1/ipInfo
 */
router.get('/fetch/', API.fetchAllIpInfoAsync)
router.get('/fetch/id/:id', API.fetchIdIpInfoAsync)
router.get('/fetch/ip/:ip', API.fetchIpIpInfoAsync)
router.post('/create/', API.createIpInfoAsync)
router.patch('/update/:id', API.updateIpInfoAsync)
router.delete('/delete/:id', API.deleteIpInfoAsync)

module.exports = router;