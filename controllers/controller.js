// *********************************************************************************
// controller.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

const axios = require('axios')

// Requiring our models
var db = require("../models");
var nodemailer = require("nodemailer");

// Routes
// =============================================================
module.exports = function (app) {
  // Get route
  app.get("/", function (req, res) {
    res.render("index").end();
  });

  // POST route
  app.post("/email", function (req, res) {
    db.Owner.findOne({
      where: {
        id: req.body.userId,

      },
    }).then(function (data) {
      //email addresses

      const newEmail = {
        from: "patchedapp@gmail.com", //can we get from DB using ID?
        to: "chrissakwa@gmail.com", //can we get from DB using ID?
        subject: "testing nodemailer",
        text: "this works as is",
      };

      //transportation module

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "patchedapp@gmail.com",
          pass: "Project2!",
        },
      });

      //email sending
      transport.sendMail(newEmail, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("email sent successfully" + info);
        }
      });
    });
    res.json(data);
    // const userType = req.body.userType,
    // const userId = req.body.userId,
    // const emailBody = req.body.emailBody
  });

  // DELETE route
  app.delete("/", function (req, res) {});

  // PUT route
  app.put("/api/posts", function (req, res) {});

};
