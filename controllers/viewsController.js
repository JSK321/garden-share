const express = require("express");
const router = express.Router();
const db = require("../models");

// HTML routes =================================
// return index.handebars
router.get("/", function (req, res) {
    res.render("index");
});

// return profile.handlebars
router.get("/profile", function (req, res) {
    res.render("profile")
});

// return profile.handlebars by id
router.get("/profile/:id", function (req, res) {
    db.Owner.findOne({ where: { id: req.params.id } }).then(result => {
        // console.log(result.toJSON())
        res.render("profile", result.toJSON())
    }).catch(err => {
        res.status(500).send(err);
    })
});
// return signup.handlebars for owners
router.get("/owners/signup", function (req, res) {
    res.render("signup", { route: "/api/owners" })
});
// return signup.handlebars for gardeners
router.get("/gardeners/signup", function (req, res) {
    res.render("signup", { route: "/api/gardeners" })
});
<<<<<<< HEAD
=======
// Return email.handlebars 
router.get("/email/:gardenId/:gardenerId", function (req, res) {
    db.Garden.findOne({ where: { id: req.params.gardenId } }).then(result => {
        console.log(result.toJSON().name)
        const renderObj = {
            gardenName: result.toJSON().name,
            ownerId: result.toJSON().OwnerId,
            gardenerId: req.params.gardenerId,
            gardenId: result.toJSON().id
        }
        res.render("email", renderObj)
    }).catch(err => {
        res.status(500).send(err);
    })
})
// Return assign_garden.handlebars
router.get("/gardens/assign/:gardenId/:gardenerId", function (req, res) {
    db.Garden.findOne({ where: { id: req.params.gardenId } }).then(garden => {
        db.Gardener.findOne({ where: { id: req.params.gardenerId } }).then(gardener=>{
            res.render("assign_garden", {
                gardenName: garden.toJSON().name,
                gardenId: req.params.gardenId,
                gardenerId: req.params.gardenerId,
                gardenerName: gardener.toJSON().username,
                ownerId: garden.toJSON().OwnerId
            })
        }
        ).catch(err => {
            console.log(err);
            res.status(500).end();
        })
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    })
})

// return map.handlebars
router.get("/map/:id?", async function (req, res) {
    let mapData = {};
    try {

        if (req.params.id) {
            const gardener = await db.Gardener.findOne({ where: { id: req.params.id } })
            mapData.mapLocation = [gardener.latitude, gardener.longitude]
        } else {
            mapData.mapLocation = [47.649349, -122.321053]
        }

        const gardens = await db.Garden.findAll()
        mapData.gardenPins = gardens.map(garden => {
            gardenJSON = garden.toJSON();
            return [gardenJSON.latitude, gardenJSON.longitude]
        })

        const composts = await db.Compost.findAll()
        mapData.compostPins = composts.map(compost => {
            compostJSON = compost.toJSON();
            return [compostJSON.latitude, compostJSON.longitude]
        })
        res.render("map", mapData)
    } catch (err) {
        console.log(err)
        res.status(500).end()
    }
})

>>>>>>> dev

module.exports = router;