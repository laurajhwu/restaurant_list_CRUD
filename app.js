//GET MODULES, DATABASE, AND SET UP SERVER/////////
//get and execute express 
const express = require('express');
const exphbr = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const port = 3000;

const routes = require('./routes') // will auto get index.js

const app = express();

// execute mongoose
require('./config/mongoose');

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










