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
        console.log(result.toJSON())
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

// return map.handlebars
router.get("/map/:id", function (req, res) {
    console.log("i am inside the get method for the map")
    db.Gardener.findOne({ where: { id: req.params.id } }).then(gardener => {
        const mapData = {
            mapLocation: [gardener.latitude, gardener.longitude]
        }
        db.Garden.findAll().then(gardens => {
            mapData.gardenPins = gardens.map(garden => {
                gardenJSON = garden.toJSON();
                return [gardenJSON.latitude, gardenJSON.longitude]
            })

            db.Compost.findAll().then(composts => {
                mapData.compostPins = composts.map(compost => {
                    compostJSON = compost.toJSON();
                    return [compostJSON.latitude, compostJSON.longitude]
                })

                res.render("map", mapData)
            }).catch(err => { res.status(500).json(err) })
        }).catch(err => { res.status(500).json(err) })

        // 
    }).catch(err => { res.status(500).json(err) })
});

module.exports = router;