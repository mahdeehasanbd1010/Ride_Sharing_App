const express = require('express');
const drivers = require('../data_set/Drivers');
const router = express.Router();

router.get('/getAllDriver', async (req, res) => {
    try{ 
        await res.json(drivers);
    }catch(err){
        res.send(err);
    }    
});


router.post('/add', async (req, res) => {
    const driver = {
        name: req.body.name,
        car_number: req.body.car_number,
        x_coordinates: req.body.x_coordinates,
        y_coordinates: req.body.y_coordinates,
        status: req.body.status
    };
    try{
        await drivers.push(driver);
    }catch(err){
        res.send(err);
    }
});

module.exports = router;
