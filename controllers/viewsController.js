const express = require("express");
const router = express.Router();
const db = require("../models");

// HTML routes =================================
// return index.handebars
router.get("/", function (req, res) {

    const model = {
        coord: { lat: 51.505, lon: -0.09 },
        markers: [
            { lat: 51.505, lon: -0.09 },
            { lat: 51.505, lon: -0.10 },
        ]
    }

    res.render("_map", model);
});

// return profile.handlebars
router.get("/profile", function (req, res) {
    if (req.session.user && req.session.user.userType === "owner") {
        db.Owner.findOne({ where: { id: req.session.user.id } }).then(result => {
            // console.log(result.toJSON())
            res.render("profile", result.toJSON())
        }).catch(err => {
            res.status(500).send(err);
        })
    } else {
        res.redirect("/owners/login")
    }
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
    res.render("signup", { route: "/owners/signup" })
});
// return signup.handlebars for gardeners
router.get("/gardeners/signup", function (req, res) {
    res.render("signup", { route: "/gardeners/signup" })
});
// Return email.handlebars 
router.get("/email/:gardenId/", function (req, res) {
    if (req.session.user && req.session.user.userType === "gardener") {
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
            res.status(500).json(err);
        })
    } else {
        res.redirect("/gardeners/login")
    }
})

// return gardens_post.handlebars to post garden by id
router.get("/gardens/add", function (req, res) {
    if (req.session.user && req.session.user.userType === "owner") {
        res.render("gardens_post", {id: req.session.user.id})
    } else {
        res.redirect("/owners/login")
    }
})

// Get route to Compost Add Form 
router.get("/composts/add", function (req, res) {
    if (req.session.user && req.session.user.userType === "owner") {
    res.render("composts_post", {id: req.session.user.id})
    } else {
        res.redirect("/owners/login")
    }
})
// Get route to Compost Add Form by id
router.get("/composts/add/:id", function (req, res) {
    res.render("composts_post", req.params)
})
// Get route to Garden Edit form
router.get("/gardens/edit", function (req, res) {
    if (req.session.user && req.session.user.userType === "owner") {
        db.Garden.findOne({
            where: {
                OwnerId: req.session.user.id
            }
        }).then((garden) => {
            if (!garden) {
                res.status(400).send("You have no gardens")
            } else {
                res.render("garden_edit", garden.toJSON());
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send()
        });
    } else {
        res.redirect("/owners/login");
    }
});

// Return assign_garden.handlebars
router.get("/gardens/assign/:gardenId/:gardenerId", function (req, res) {
    db.Garden.findOne({ where: { id: req.params.gardenId } }).then(garden => {
        db.Gardener.findOne({ where: { id: req.params.gardenerId } }).then(gardener => {
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
router.get("/map", async function (req, res) {
    let mapData = {};
    try {
        if (req.session.user && req.session.user.userType === "gardener") {
            console.log("I am a gardener")
            const gardener = await db.Gardener.findOne({ where: { id: req.session.user.id } })
            mapData.mapLocation = [gardener.latitude, gardener.longitude]
            mapData.loggedIn = true
            mapData.GardenerId = gardener.id
        } else {
            mapData.mapLocation = [47.649349, -122.321053]
            mapData.loggedIn = false
        }

        const gardens = await db.Garden.findAll()
        mapData.gardenPins = gardens.map(garden => {
            gardenJSON = garden.toJSON();
            return {
                location: [gardenJSON.latitude, gardenJSON.longitude],
                name: gardenJSON.name,
                id: gardenJSON.id
            }
        })

        const composts = await db.Compost.findAll()
        mapData.compostPins = composts.map(compost => {
            compostJSON = compost.toJSON();
            return {
                location: [compostJSON.latitude, compostJSON.longitude],
                name: compostJSON.name,
                id: compostJSON.id
            }
        })
        res.render("map", mapData)
    } catch (err) {
        console.log(err)
        res.status(500).end()
    }
})
// display gardens by id
router.get("/gardens/:id", function (req, res) {
    db.Garden.findOne({ where: { id: req.params.id } }).then(garden => {
        gardenJSON = garden.toJSON();
        if (req.session.user && req.session.user.userType === "gardener") {
            gardenJSON.PotentialGardenerId = req.session.user.id
            console.log(gardenJSON)
        }
        res.render("garden_display", gardenJSON)
    })
})
// Route to display compost by id
router.get("/composts/:id/", function (req, res) {
    db.Compost.findOne({ where: { id: req.params.id } }).then(compost => {
        compostJSON = compost.toJSON();
        res.render("compost_display", compostJSON)
    })
})
//route to edit compost
router.get("/composts/edit/:OwnerId", function (req, res) {
    db.Compost.findOne({
      where: {
        OwnerId: req.params.OwnerId
      }
    }).then((compost) => {
      res.render("compost_edit", compost.toJSON());
    }).catch(err=>{
        console.log(err)
        res.status(500).send("Error!")
    })
});
  
// Route to display login
router.get("/gardeners/login", function (req, res) {
    res.render("login", { route: "/gardeners/login" })
})

router.get("/owners/login", function (req, res) {
    res.render("login", { route: "/owners/login" })
});

router.get('/logout', (req, res) => {

    req.session.destroy()
    res.redirect("/")
        
});

module.exports = router;