const express = require('express')
const router = express.Router()
const ratings = require('../../models/Ratings')


router.post('/add', async (req, res)=> {
    const rating = new ratings({
        driver_name: req.body.driver_name,
        rating: req.body.rating
    })
    console.log(req.body.driver_name + ' -> rating:' + req.body.rating)
    try {
        const result = await rating.save()
        res.json(result)
        //console.log('result: ' + result)
    }catch(err){
        res.send(err)
        console.log('err:' + err)
    }
})


module.exports = router


