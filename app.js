//GET MODULES, DATABASE, AND SET UP SERVER/////////
//get and execute express 
const express = require('express');
const exphbr = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const port = 3000;
const Restaurant = require('./models/restaurant');

const app = express();

//from other files
const routes = require('./routes') // will auto get index.js

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
//set up body-parser
app.use(bodyParser.urlencoded({ extended: true }))
//set method override
app.use(methodOverride('_method'));

//get routes
app.use(routes);

//start server to listen
app.listen(port, () => {
    console.log(`Express is listening to localhost:${port}`);
})

//DISPLAY CONTENT AND SET SEARCH BAR///////

//order format
app.get('/sort', (req, res) => {
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








