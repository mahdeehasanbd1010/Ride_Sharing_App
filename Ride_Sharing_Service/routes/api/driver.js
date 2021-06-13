const express = require('express')
const router = express.Router()
const drivers = require('../../data_set/Drivers')

router.post('/add', async (req, res)=> {
    const driver = {
        name: req.body.name,
        car_number: req.body.car_number,
        x_coordinates: req.body.x_coordinates,
        y_coordinates: req.body.y_coordinates,
        status: req.body.status
    }
    try{
        const result = await drivers.push(driver);
        res.json(result)
    }catch(err){
        res.send(err)
    }

})

module.exports = router
