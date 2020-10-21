// Require express
var express = require("express");
var app = express();

// require the database
var db = require("./models");

// Set port for local and deployed
var PORT = process.env.PORT || 8080;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
const viewRoutes = require("./controllers/viewsController.js")
app.use(viewRoutes)

const ownerRoutes = require("./controllers/ownerController.js")
app.use(ownerRoutes)

// Sync database and start listening
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
