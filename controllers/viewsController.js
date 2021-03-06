const express = require("express");
const router = express.Router();
const db = require("../models");

// HTML routes =================================
// return index.handebars
router.get("/", function (req, res) {
    if (req.session.user) {
        res.render("index", { loggedIn: true });
    } else {
        res.render("index")
    }

});

router.get("/profile", function (req, res) {
    if (req.session.user && req.session.user.userType === "owner") {
        db.Owner.findOne({
            where: { id: req.session.user.id },
            include: [
                {
                    model: db.Garden,
                    include: [
                        {
                            model: db.Request
                        }
                    ]
                }
            ]
        }).then(result => {
            let hbsObject = result.toJSON();
            hbsObject.loggedIn = true;
            if (hbsObject.Gardens.length > 0){
                hbsObject.GardenId = hbsObject.Gardens[0].id;
            }
            res.render("profile", hbsObject)
        }).catch(err => {
            console.log(err)
            res.status(500).end();
        })
    }
    else {
        res.redirect("/owners/login")
    }
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
            const renderObj = {
                gardenName: result.toJSON().name,
                ownerId: result.toJSON().OwnerId,
                gardenerId: req.params.gardenerId,
                gardenId: result.toJSON().id
            }
            let hbsObject = renderObj;
            hbsObject.loggedIn = true;
            res.render("email", hbsObject)
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
        let hbsObject = { id: req.session.user.id };
        hbsObject.loggedIn = true;
        res.render("gardens_post", hbsObject)
    } else {
        res.redirect("/owners/login")
    }
})

// Get route to Compost Add Form 
router.get("/composts/add", function (req, res) {
    if (req.session.user && req.session.user.userType === "owner") {
        let hbsObject = {id: req.session.user.id};
        hbsObject.loggedIn = true;
        res.render("composts_post", hbsObject)
    } else {
        res.redirect("/owners/login")
    }
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
                res.status(400).end()
            } else {
                let hbsObject = garden.toJSON();
                hbsObject.loggedIn = true;
                res.render("garden_edit", hbsObject);
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
            let hbsObject = {
                gardenName: garden.toJSON().name,
                gardenId: req.params.gardenId,
                gardenerId: req.params.gardenerId,
                gardenerName: gardener.toJSON().username,
                ownerId: garden.toJSON().OwnerId

            };
            hbsObject.loggedIn = true;

            res.render("assign_garden", hbsObject)
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
        if (req.session.user) {
            mapData.loggedIn = true
        }

        res.render("map", mapData)
    }

    catch (err) {
        console.log(err)
        res.status(500).end()
    }
})
// display gardens by id
router.get("/gardens/:id", function (req, res) {
    db.Garden.findOne({ where: { id: req.params.id } }).then(garden => {
        gardenJSON = garden.toJSON();
        let hbsObject = gardenJSON;
        if (req.session.user) {
            hbsObject.loggedIn = true;
            if (req.session.user.userType === "owner") {
                hbsObject.justPosted = true;
            } else {
                hbsObject.PotentialGardenerId = req.session.user.id
            }
        }
        res.render("garden_display", hbsObject)
    })
})
// Route to display compost by id
router.get("/composts/:id/", function (req, res) {
    db.Compost.findOne({ where: { id: req.params.id } }).then(compost => {
        compostJSON = compost.toJSON();
       compostJSON.loggedIn = true;
      
        res.render("compost_display", compostJSON)
    })
})

// Route to display login
router.get("/gardeners/login", function (req, res) {
    res.render("login", { route: "/gardeners/login" })
})

router.get("/owners/login", function (req, res) {
    res.render("login", { route: "/owners/login" })
});



module.exports = router;