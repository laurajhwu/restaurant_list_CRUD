//GET MODULES, DATABASE, AND SET UP SERVER/////////
//get and execute express 
const express = require('express');
const app = express();
const exphbr = require('express-handlebars');
const mongoose = require('mongoose');
const port = 3000;

const Restaurant = require('./models/restaurant');

//connect to mongodb and store connection status
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
//show success and handle failures
db.on('error', () => console.log('mongodb error!'));
db.once('open', () => console.log('mongodb connected!'));

//set template engine
app.engine('hbs', exphbr({ defaultLayout: 'main', extname: ".hbs" }));
app.set('view engine', 'hbs');

//set up static files to access bootstrap and other designs
app.use(express.static('public'));

//start server to listen
app.listen(port, () => {
    console.log(`Express is listening to localhost:${port}`);
})

//DISPLAY CONTENT AND SET SEARCH BAR///////
//set route for index page (home page)
app.get('/', (req, res) => {
    //get all restaurant data and upload to index page
    return Restaurant.find()
        .lean()
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.log(error))
})

//set route for show page (info page)
app.get('/restaurants/:id', (req, res) => {
    //get the restaurant that matches the restaurant id clicked by the user
    const id = req.params.id
    return Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render('show', { restaurant }))
        .catch(error => console.log(error))
})

//set route for search bar
app.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    //get all restaurant data to see if keyword matches
    return Restaurant.find()
        .lean()
        .then(restaurants => {
            const restaurantFilter = restaurants.filter(restaurant => {
                return restaurant.name.toLowerCase().includes(keyword.trim().toLowerCase())
                    || restaurant.name_en.toLowerCase().includes(keyword.trim().toLowerCase());
            })
            //get matches and create keyword variable to keep users' query
            res.render('index', { restaurants: restaurantFilter, keyword });
        })
})