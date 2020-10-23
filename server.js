// Require express
var express = require("express");
var app = express();

// require the database
var db = require("./models");

// Set port for local and deployed
var PORT = process.env.PORT || 8080;

require("dotenv").config();
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  helpers: {
    isEqual: function (value1, value2) {
      return (value1 === value2)
    }
  }
}));
app.set("view engine", "handlebars");

// Set up authentication
// const session = require('express-session')

// I'm certain this isn't the correct way to do this...
process.env.SESSION_SECRET = 123
//...............................But it makes the server run for now

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//       maxAge: 2 * 60 * 60 * 1000
//   }
// }))
// Import routes and give the server access to them.

const ownerRoutes = require("./controllers/ownerController.js")
app.use(ownerRoutes)

const gardenerRoutes = require("./controllers/gardenerController.js")
app.use(gardenerRoutes)

const gardenRoutes = require("./controllers/gardenController.js")
app.use(gardenRoutes)

const compostRoutes = require("./controllers/compostController.js")
app.use(compostRoutes)

const emailRoutes = require("./controllers/emailController.js")
app.use(emailRoutes)

const viewRoutes = require("./controllers/viewsController.js")
app.use(viewRoutes)

// Sync database and start listening
db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});
