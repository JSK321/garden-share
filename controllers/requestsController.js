const express = require('express');
const router = express.Router();
const db = require('../models');

router.post("/requests", async function(req, res){
    if (req.session.user && req.session.user.userType === "gardener") {
        const gardener = await db.Gardener.findOne({where: {id: req.session.user.id}})
        const gardenerId = gardener.toJSON().id;
        const gardenId = parseInt(req.body.gardenId);
        console.log({
            gardenerId: gardenerId,
            gardenId: gardenId
        })
        const response = await db.Request.create({
            GardenerId: gardenerId,
            GardenId: gardenId
        })
        console.log(response);
        res.json(response)
    }
})

module.exports = router;