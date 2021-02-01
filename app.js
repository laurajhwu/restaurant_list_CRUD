//GET MODULES, DATABASE, AND SET UP SERVER/////////
//get and execute express 
const express = require('express');
const app = express();
const exphbr = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 3000;
const Restaurant = require('./models/restaurant');

//from other files
const routes = require('./routes') // will auto get index.js

//connect to mongodb and store connection status
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
//show success and handle failures
db.on('error', () => console.log('mongodb error!'));
db.once('open', () => console.log('mongodb connected!'));

//set up body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//set template engine
app.engine('hbs', exphbr({ defaultLayout: 'main', extname: ".hbs" }));
app.set('view engine', 'hbs');

//set up static files to access bootstrap and other designs
app.use(express.static('public'));

//get routes
app.use(routes);

//start server to listen
app.listen(port, () => {
    console.log(`Express is listening to localhost:${port}`);
})

//DISPLAY CONTENT AND SET SEARCH BAR///////


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

//CRUD SETTINGS/////////
//Create: add your favorite restaurant to the list
app.get('/restaurants/new', (req, res) => {
    return res.render('new');
})

app.post('/restaurants', (req, res) => {
    const newRestaurant = req.body;
    return Restaurant.create(newRestaurant)
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

//Read: set route for show page (info page)
app.get('/restaurants/:id', (req, res) => {
    //get the restaurant that matches the restaurant id clicked by the user
    const id = req.params.id
    return Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render('show', { restaurant }))
        .catch(error => console.log(error))
})

//Update: set edit route and feature
app.get('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id;
    return Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render('edit', { restaurant }))
        .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    return Restaurant.findById(id)
        .then(restaurant => {
            //loop through restaurant key names
            Object.keys(data).map(key => {
                restaurant[key] = data[key];
            })
            return restaurant.save();
        })
        .then(() => res.redirect(`/restaurants/${id}`))
        .catch(error => console.log(error))
})

//Delete: delete restaurant feature
app.post('/restaurants/:id/delete', (req, res) => {
    const id = req.params.id;
    return Restaurant.findById(id)
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

//order format
app.get('/sort/:type/:order', (req, res) => {
    const type = req.params.type
    const order = req.params.order
    const options = {
        _idAsc: '請選則排列', nameAsc: '店名：A到Z', nameDesc: '店名：Z到A', categoryAsc: '類別',
        ratingAsc: '評分：由低到高', ratingDesc: '評分：由高到低'
    };
    const currentSelection = options[type + order];
    return Restaurant.find()
        .lean()
        .sort({ [type]: [order.toLowerCase()] })
        .then(restaurants => res.render('index', { restaurants, currentSelection }))
        .catch(error => console.log(error))
})



