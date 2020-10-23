const express = require('express');
const router= express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

router.post('/owners/signup', (req, res) => {
    db.Owner.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(newUser => {
        req.session.user = {
            username: newUser.username,
            id: newUser.id,
            userType: "owner"
        }
        res.redirect("/profile/" + newUser.id)
    }).catch(err => {
        console.log(err);
        res.status(500).send("server error")
    })
})

router.post('/gardeners/signup', (req, res) => {
    db.Gardener.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(newUser => {
        req.session.user = {
            username: newUser.username,
            id: newUser.id,
            userType: "gardener"
        }
        res.redirect("/profile/" + newUser.id)
    }).catch(err => {
        console.log(err);
        res.status(500).send("server error")
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
            return res.redirect("/map")
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

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('logged out')
})

router.get("/sessiondata", (req, res) => {
    res.json(req.session)
})



module.exports = router;