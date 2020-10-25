const express = require("express");
const router = express.Router();
const db = require("../models");
var nodemailer = require("nodemailer");

// POST route to send email
router.post("/email", async function (req, res) {
  try {
    if (req.session.user && req.session.user.userType === "gardener") {
      const gardener = await db.Gardener.findOne({where: {id: req.session.user.id}})
      const gardenerJSON = gardener.toJSON()
      const garden = await db.Garden.findOne({ 
        where: { id: req.body.gardenId },
        include: db.Owner  
      })
      const gardenJSON = garden.toJSON()

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "patchedapp@gmail.com",
          pass: "Project2!",
        },
      });
      // send mail with defined transport object
      console.log(req.body)
      let info = await transporter.sendMail({
        from: "patchedapp@gmail.com", // sender address
        to: gardenJSON.Owner.email, // list of receivers
        subject: "Patched Connection", // Subject line
        // text: req.body.emailBody, // plain text body
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width" />
          <title>Patched Email</title>
          <link rel="stylesheet" href="css/foundation-emails.css" />
        </head>
        
        <body>
          <!-- <style> -->
          <table class="body" style="background-color:#3f473f;border-radius:15px" data-made-with-foundation>
            <tr>
              <td class="float-center" align="center" valign="top">
                <center>
                  <table align="center" class="container">
                    <tbody>
                        <td>
                          <table class="row" style="background-color:#7F9174">
                            <tbody>
                              <tr>
                                <th class="small-12 large-8 columns last">
                                  <table>
                                    <tbody>
                                      <tr>
                                        <th>
                                          <h1 class="small-text-center" style="color:#3f473f">Hello!</h1>
                                          <h3 class="small-text-center" style="color:white">${gardenerJSON.username}</h3>
                                          <p style="color:#3f473f">Would like to connect about your garden!</p>
                                          <p><strong style="color:#3f473f">Message:</strong></p>
                                          <p class="small-text-center" style="color:white">${req.body.emailBody}</p>
                                        </th>
                                      </tr>
                                    </tbody>
                                  </table>
                                </th>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                    </tbody>
                  </table>
        
                  <table class="button rounded">
                    <tbody>
                      <tr>
                        <td>
                          <table>
                            <tbody>
                              <tr>
                                <br>
                                <td><a href=http://localhost:8080/gardens/assign/${gardenJSON.id}/${gardenerJSON.id}' class="button" style="border-radius:15px;background-color: #7F9174;color:white">Share your garden</a></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
        
                </center>
              </td>
            </tr>
          </table>
        </body>
        </html>
        
        `, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      res.send("Message Sent")
    }
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }

});


module.exports = router;
