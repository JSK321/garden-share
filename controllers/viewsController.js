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
// return signup.handlebars
router.get("/signup", function (req, res) {
    res.render("signup")
});
module.exports = router;