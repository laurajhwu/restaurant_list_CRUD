const db = require('../../config/mongoose');
const Restaurant = require('../restaurant');
const data = require('../../restaurant.json');

db.once('open', () => {
    console.log('mongodb connected!');

    data.results.map(restaurant => {
        //store restaurant data in to mongodb based on pre-defined schema
        Restaurant.create(restaurant);
    })
    console.log("done");
})