const express = require("express");
const router = express.Router();
const db = require("../models");
const { route } = require("./ownerController");

// HTML routes =================================
// return index.handebars
router.get("/", function (req, res) {
    res.render("index");
});

// return profile.handlebars
router.get("/profile", function(req,res){
    res.render("profile")
});

// return profile.handlebars by id
router.get("/profile/:id", function (req, res) {
    db.Owner.findOne({where: {id: req.params.id}}).then(result=>{
        console.log(result.toJSON())
        res.render("profile", result.toJSON())
    }).catch(err=>{
        res.status(500).send(err);
    })
});
// return signup.handlebars for owners
router.get("/owners/signup", function (req, res) {
    res.render("signup", {route: "/api/owners"})
});
// return signup.handlebars for gardeners
router.get("/gardeners/signup", function (req, res) {
    res.render("signup", {route: "/api/gardeners"})
});

module.exports = router;