const mongoose = require('mongoose');
const Restaurant = require('../restaurant');
const data = require('../../restaurant.json');

//connect to mongodb and store connection status
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
//show success and handle failures
db.on('error', () => console.log('mongodb error!'));
db.once('open', () => {
    console.log('mongodb connected!');

    data.results.map(restaurant => {
        //store restaurant data in to mongodb based on pre-defined schema
        Restaurant.create(restaurant);
    })
    console.log("done");
})