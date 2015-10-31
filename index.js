var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy
var nconf = require("nconf");
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var migrate = require("migrate");
var chalk = require("chalk");

var UserModel = require("./models/userModel");
var activityRoutes = require("./routes/activityRoutes");
var userRoutes = require("./routes/userRoutes");

nconf.file({
    file: "./settings.json"
});
const port = nconf.get("port");
const dbUri = nconf.get("mongoose:uri");

var app = express();
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: "So much mystery",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(activityRoutes);
app.use(userRoutes);

passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

mongoose.connect(dbUri);
var db = mongoose.connection;
var migration = migrate.load("migrations/.migrate", "./migrations");

db.on("error", function (err) {
    console.error("Connection error:", err.message);
});

db.once("open", function () {
    console.log(chalk.cyan("Connected to DB"));
    console.log(chalk.cyan("Starting database migration"));

    migration.up(function (error) {
        if (error) {
            throw error;
        }

        console.log(chalk.cyan("Migration complete"));

        app.listen(port);
        console.log(chalk.green("Express application started on port " + port));
    });
});



