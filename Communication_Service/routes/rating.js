const express = require('express')
const router = express.Router()
const ratings = require('../data_set/Ratings')


router.post('/add', async (req, res) => {
    
    const rating = {
        driver_name : req.body.driver_name,
        rider_name: req.body.rider_name,
        fare : req.body.fare,
        status: req.body.status
    }
    try {
        const result = await ratings.push(rating)
        res.json(result)
    }catch(err){
        res.send(err)
    }
    
})


module.exports = router




