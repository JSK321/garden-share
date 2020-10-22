const express = require("express");
const router = express.Router();
const db = require("../models")
var nodemailer = require("nodemailer");

// POST route to send email
router.post("/email", function (req, res) {
  console.log(req.body)
  db.Owner.findOne({
    where: {
      id: req.body.ownerId
    },
  }).then(async function (data) {
       // create reusable transporter object using the default SMTP transport
       let testAccount = await nodemailer.createTestAccount();
    console.log(req.body)
       // create reusable transporter object using the default SMTP transport
       let transporter = nodemailer.createTransport({
         host: "smtp.ethereal.email",
         port: 587,
         secure: false, // true for 465, false for other ports
         auth: {
           user: testAccount.user, // generated ethereal user
           pass: testAccount.pass, // generated ethereal password
         },
       });
      // send mail with defined transport object
      try {
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
      res.send("Message Sent")
    } catch (err) {
      console.log(err)
      res.status(500).end()
    }
    })
    
    
    
  //   const newEmail = {
  //     from: "patchedapp@gmail.com", //can we get from DB using ID?
  //     to: data.email, //can we get from DB using ID?
  //     subject: "Patched Connection",
  //     text: req.body.emailBody,
  //   };
  //   //email sending
  //   transport.sendMail(newEmail, (err, info) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("email sent successfully" + info);
  //     }
  //     res.json(data);
  //     // const userType = req.body.userType,
  //     // const userId = req.body.userId,
  //     // const emailBody = req.body.emailBody
  //   });
  // }).catch(err=>{
  //   console.log(err)
  //   res.status(500).end()
  // });
});



module.exports = router;



