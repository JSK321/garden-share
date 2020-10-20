// *********************************************************************************
// controller.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // Get route
  app.get("/", function(req, res) {
    res.render("index").end()
  });


  // POST route 
  app.post("/:email", function(req, res) {
    const userType = req.body.userType,
    const userId = req.body.userId,
    const emailBody = req.body.emailBody
      });

  // DELETE route 
  app.delete("/", function(req, res) {

  });

  // PUT route
  app.put("/api/posts", function(req, res) {

  });
};
