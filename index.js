var express = require("express");
var bodyParser = require("body-parser");
var nconf = require("nconf");
var mongoose = require("mongoose");
var migrate = require("migrate");
var chalk = require("chalk");

var ActivityController = require("./controllers/activityController");

nconf.file({
    file: "./settings.json"
});

const port = nconf.get("port");
const dbUri = nconf.get("mongoose:uri");

var app = express();

app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/api/activities", function (req, res) {
    console.log(ActivityController.getActivities());
    return res.json(ActivityController.getActivities());
});

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



