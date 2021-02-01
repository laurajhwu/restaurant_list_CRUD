//general route
const express = require('express');
const router = express.Router();

//home page route
const home = require('./modules/home');
router.use('/', home);
//CRUD setting routes
const restaurants = require('./modules/restaurants');
router.use('/restaurants', restaurants);
//search bar route
const search = require('./modules/search');
router.use('/search', search);
//sorting function route
const sort = require('./modules/sort');
router.use('/sort', sort)

module.exports = router