const express = require("express");
const router = express.Router();
const db = require("../models");
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
    // console.log(data);
    // const newEmail = {
    //   from: "patchedapp@gmail.com", //can we get from DB using ID?
    //   to: receivingEmail, //can we get from DB using ID?
    //   subject: "testing nodemailer",
    //   text: "this works as is",
    // };
    // res.json(data);

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

    console.log(req.body);
    db.Owner.findOne({
      where: {
        id: req.body.ownerId,
      },
    }).then(async function (data) {
      // create reusable transporter object using the default SMTP transport
      let testAccount = await nodemailer.createTestAccount();
      console.log(req.body);
      // create reusable transporter object using the default SMTP transport

      //transportation module
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "patchedapp@gmail.com",
            pass: "Project2!",
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: "patchedapp@gmail.com", // sender address
          to: data.toJSON().email, // list of receivers
          subject: "Patched Connection", // Subject line
          // text: req.body.emailBody, // plain text body
          html: `${req.body.emailBody} <br><a href='localhost:8080/gardens/assign/${req.body.gardenId}/${req.body.gardenerId}'>Share your garden</a>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        res.send("Message Sent");
      } catch (err) {
        console.log(err);
        res.status(500).end();
      }
    });
  });
});

module.exports = router;
