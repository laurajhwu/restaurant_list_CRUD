const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

//order format
router.get('/', (req, res) => {
    const selection = req.query.sort.split('/');
    const type = selection[0];
    const order = selection[1];
    let selected = { [`${type}_${order}`]: 'selected' }
    return Restaurant.find()
        .lean()
        .sort({ [type]: [order] })
        .then(restaurants => res.render('index', { restaurants, selected }))
        .catch(error => console.log(error))
})

module.exports = router;
