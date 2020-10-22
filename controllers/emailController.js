const express = require("express");
const router = express.Router();
const db = require("../models")
var nodemailer = require("nodemailer");

// POST route to send email
router.post("/email", function (req, res) {
  console.log(req.user.email);
  // The email that the sender typed in
  const receivingEmail = req.body.receivingEmail;
  db.Owner.findOne({
    where: {
      id: req.body.userId,
    },
  }).then(function (data) {
    //email addresses
    console.log(data);
    const newEmail = {
      from: "patchedapp@gmail.com", //can we get from DB using ID?
      to: receivingEmail, //can we get from DB using ID?
      subject: "testing nodemailer",
      text: "this works as is",
    };
    res.json(data);


    //email sending
    // transport.sendMail(newEmail, (err, info) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log("email sent successfully" + info);
    //   }
    //   res.json(data);
    //   // const userType = req.body.userType,
    //   // const userId = req.body.userId,
    //   // const emailBody = req.body.emailBody
    // });
  });
});

module.exports = router;



