const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

//set route for index page (home page)
router.get('/', (req, res) => {
    //set default value for sort dropdown
    const currentSelection = '請選則排列';
    //get all restaurant data and upload to index page
    return Restaurant.find()
        .lean()
        .sort({ _id: 'asc' })
        .then(restaurants => res.render('index', { restaurants, currentSelection }))
        .catch(error => console.log(error))
})

module.exports = router;
