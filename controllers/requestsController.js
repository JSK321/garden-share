const express = require('express');
const router = express.Router();
const db = require('../models');

router.post("/requests", async function (req, res) {
    if (req.session.user && req.session.user.userType === "gardener") {
        const gardener = await db.Gardener.findOne({ where: { id: req.session.user.id } })
        const gardenerId = gardener.toJSON().id;
        const gardenId = parseInt(req.body.gardenId);
        const response = await db.Request.create({
            GardenerId: gardenerId,
            GardenId: gardenId
        })
        res.json(response)
    }
})

router.get("/requests/:id", function (req, res) {
    db.Request.findAll({
        where: { GardenId: req.params.id },
        include: [db.Garden, db.Gardener]
    }).then(response=>{
        if(response){
            let responseJSON = response.map(element=>element.toJSON())
            res.json(responseJSON)
        }
    })
})

router.delete("/requests/:gardenId", function(req, res){
    db.Request.destroy({
        where: {GardenId: req.params.gardenId}
    }).then(result=>{
        res.json(result)
    })
})

module.exports = router;