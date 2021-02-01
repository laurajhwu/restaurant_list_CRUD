//general route
const express = require('express');
const router = express.Router();

//get routes
const home = require('./modules/home');
router.use('/', home);

module.exports = router