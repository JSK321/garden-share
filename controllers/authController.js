const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const axios = require("axios");
const session = require('express-session');

router.post('/owners/signup', (req, res) => {
    const APIKey = '0a157990-f940-11ea-ac04-cb65445966da'
    axios.get(`https://app.geocodeapi.io/api/v1/search?apikey=${APIKey}&text=${req.body.address}`)
        .then(response => {
            db.Owner.create({
                username: req.body.username,
                email: req.body.email,
                address: req.body.address,
                latitude: response.data.bbox[1],
                longitude: response.data.bbox[0],
                password: req.body.password
            }).then(newUser => {
                req.session.user = {
                    username: newUser.username,
                    id: newUser.id,
                    userType: "owner"
                }
                res.redirect("/profile")
            }).catch(err => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    res.status(400).send("Username already exists. Please choose a unique username")
                } else {
                    res.status(500).json(err)
                }
            })
        })

})

router.post('/gardeners/signup', (req, res) => {
    const APIKey = '0a157990-f940-11ea-ac04-cb65445966da'
    axios.get(`https://app.geocodeapi.io/api/v1/search?apikey=${APIKey}&text=${req.body.address}`)
        .then(response => {
            db.Gardener.create({
                username: req.body.username,
                email: req.body.email,
                address: req.body.address,
                latitude: response.data.bbox[1],
                longitude: response.data.bbox[0],
                password: req.body.password
            }).then(newUser => {
                req.session.user = {
                    username: newUser.username,
                    id: newUser.id,
                    userType: "gardener"
                }
                res.redirect("/map")
            }).catch(err => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    res.status(400).send("Username already exists. Please choose a unique username")
                } else {
                    res.status(500).json(err)
                }
            })
        })
})

router.post('/owners/login', (req, res) => {
    db.Owner.findOne({
        where: { username: req.body.username }
    }).then(user => {
        //check if user entered password matches db password
        console.log(req.body.password)
        console.log(user.password)
        if (!user) {
            req.session.destroy();
            return res.status(401).send('incorrect username or password')

        } else if (bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = {
                username: user.username,
                id: user.id,
                userType: "owner"
            }
            return res.redirect("/profile")
        }
        else {
            req.session.destroy();
            return res.status(401).send('incorrect username or password')
        }
    })
})

router.post('/gardeners/login', (req, res) => {
    db.Gardener.findOne({
        where: { username: req.body.username }
    }).then(user => {
        //check if user entered password matches db password
        console.log(req.body.password)
        console.log(user.password)
        if (!user) {
            req.session.destroy();
            return res.status(401).send('incorrect username or password')

        } else if (bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = {
                username: user.username,
                id: user.id,
                userType: "gardener"
            }
            return res.redirect("/map")
        }
        else {
            req.session.destroy();
            return res.status(401).send('incorrect username or password')
        }
    })
})


router.get("/sessiondata", (req, res) => {
    res.json(req.session)
   })

//authentication for the handlebars
// router.use((req,res) => {
//     if(req.session) res.session.user = req.session();
//    });



module.exports = router;