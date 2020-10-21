const express = require("express");
const router = express.Router();
const db = require("../models")

// HTML routes =================================
// return index.handebars
router.get("/", function (req, res) {
    res.render("index");
});
// return profile.handlebars
router.get("/profile", function (req, res) {
    res.render("profile")
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