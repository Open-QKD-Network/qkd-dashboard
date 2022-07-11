//IMPORTS.
const express = require('express');
const router = express.Router();
const API = require('../api/locationApi');

router.get('/fetch', API.fetchAllPosts)
router.post('/create', API.createPost)

module.exports = router;