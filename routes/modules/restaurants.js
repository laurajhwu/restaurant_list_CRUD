const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

//CRUD SETTINGS/////////
//Create: add your favorite restaurant to the list
router.get('/new', (req, res) => {
    return res.render('new');
})

router.post('/', (req, res) => {
    const newRestaurant = req.body;
    return Restaurant.create(newRestaurant)
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

//Read: set route for show page (info page)
router.get('/:id', (req, res) => {
    //get the restaurant that matches the restaurant id clicked by the user
    const id = req.params.id
    return Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render('show', { restaurant }))
        .catch(error => console.log(error))
})

//Update: set edit route and feature
router.get('/:id/edit', (req, res) => {
    const id = req.params.id;
    return Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render('edit', { restaurant }))
        .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    return Restaurant.findById(id)
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})


module.exports = router;