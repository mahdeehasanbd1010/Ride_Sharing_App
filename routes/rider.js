const express = require('express');
const router = express.Router();
const riders = require('../data_set/Riders');

router.get('/getAllRider', async (req, res) => {
    try{
        await res.json(riders);
    }catch(err){
        res.send(err);
    }
});


router.post('/add', async(req, res) => {
    const rider = {
        name: req.body.name,
        x_coordinates: req.body.x_coordinates,
        y_coordinates: req.body.y_coordinates,
        x_destination: req.body.x_destination,
        y_destination: req.body.y_destination,
        status: req.body.status
    };
    try{
        await riders.push(rider);
    }catch(err){
        res.send(err);
    }

});

module.exports = router;