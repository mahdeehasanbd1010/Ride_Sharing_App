const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');

router.post('/add', async (req, res) => {
    const rating = new Rating({
        name: req.body.name,
        rating: req.body.rating    
    });
    try{
        const result = await rating.save();
        res.json(result);
    }catch(err){
        res.send(err);
    }
});



module.exports = router;
