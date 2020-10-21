// *********************************************************************************
// controller.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================



// Requiring our models
var db = require("../models");
var nodemailer = require("nodemailer");

// Routes
// =============================================================
module.exports = function (app) {
 


  
  

  // Compost routes =======================================
  
  


  // Email post route ============================
  // POST route to send email
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
      //email sending
      transport.sendMail(newEmail, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("email sent successfully" + info);
        }
        res.json(data);
        // const userType = req.body.userType,
        // const userId = req.body.userId,
        // const emailBody = req.body.emailBody
      });
    });
  });

}



