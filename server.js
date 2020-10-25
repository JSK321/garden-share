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
// Parse file uploads
const fileupload = require('express-fileupload')
app.use(fileupload())

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  helpers: {
    isEqual: function (value1, value2) {
      return (value1 === value2)
    },

  }
}));
app.set("view engine", "handlebars");

// Set up authentication
const session = require('express-session')

// 
app.use(session({
  secret: "gardendirt",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000
  }
}))

// app.use(function (req, res, next) {
//   //res.render("main.handlebars", { hilo: "hola" })
//   //req.someValue = exphbs.getPartials();
//   req.someOtherValue = {hola:"hola"};
//   next();
// })
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

const authRoutes = require("./controllers/authController.js")
app.use(authRoutes)

const requestRoutes = require("./controllers/requestsController.js")
app.use(requestRoutes)

// Sync database and start listening
db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});