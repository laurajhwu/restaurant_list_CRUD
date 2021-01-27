//GET MODULES, DATABASE, AND SET UP SERVER/////////
//get and execute express 
const express = require('express');
const app = express();
const exphbr = require('express-handlebars');
const mongoose = require('mongoose');
const port = 3000;

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

//DISPLAY CONTENT AND SET FUNCTIONS///////
//set route for index page (home page)
app.get('/', (req, res) => {
    //upload restaurant data to page using handlebars' {{#each}}
    res.render('index', { restaurants: restaurantList.results });
})

//set route for show page (info page)
app.get('/restaurants/:id', (req, res) => {
    //get the restaurant that matches the restaurant id clicked by the user
    const restaurant = restaurantList.results.find(restaurant => {
        return restaurant.id.toString() === req.params.id;
    })
    res.render('show', { restaurant: restaurant });
})

//set route for search bar
app.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    const restaurants = restaurantList.results.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.trim().toLowerCase())
            || restaurant.name_en.toLowerCase().includes(keyword.trim().toLowerCase());
    })
    //create keyword variable to keep users' query
    res.render('index', { restaurants: restaurants, keyword: keyword });
})