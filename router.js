var express = require("express");
var router = express.Router();

var ActivityController = require("./controllers/activityController");

router.get("/", function (req, res) {
    res.send("Hello World");
});

router.get("/api/activities", function (req, res) {
    ActivityController.getActivities().then(
        function (data) {
            res.json(data);
        },
        function (error) {
            throw error;
        }
    );
});

router.post("/api/activities", function (req, res) {
    ActivityController.saveActivity({
        date: req.body.date,
        name: req.body.name,
        duration: req.body.duration,
        milestones: req.body.milestones
    }).then(
        function (data) {
            res.json(data);
        },
        function (error) {
            res.status(500).send("So much error.");
            throw error;
        }
    );
});

module.exports = router;