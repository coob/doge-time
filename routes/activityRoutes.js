var express = require("express");
var router = express.Router();

var ActivityController = require("../controllers/activityController");

var handleError = function (res, error) {
    res.status(500).send("So much error.");
    throw error;
};

router.get("/api/activities", function (req, res) {
    ActivityController
        .getActivities(req.query.from, req.query.to)
        .then(
            function (data) {
                res.json(data);
            },
            function (error) {
                handleError(res, error);
            }
        );
});

router.post("/api/activity", function (req, res) {
    ActivityController
        .saveActivity({
            date: req.body.date,
            name: req.body.name,
            duration: req.body.duration,
            milestones: req.body.milestones
        })
        .then(
            function (data) {
                res.json(data);
            },
            function (error) {
                handleError(res, error);
            }
        );
});

router.get("/api/activity/:id", function (req, res) {
    ActivityController
        .getActivity(req.params.id)
        .then(
            function (data) {
                res.json(data);
            },
            function (error) {
                handleError(res, error);
            }
        )
});

router.post("/api/activity/:id", function (req, res) {
    ActivityController
        .updateActivity(req.params.id, req.body)
        .then(
            function (data) {
                res.json(data);
            },
            function (error) {
                handleError(res, error);
            }
        );
});

router.delete("/api/activity/:id", function (req, res) {
    ActivityController
        .deleteActivity(req.params.id)
        .then(
            function (data) {
                res.json(data);
            },
            function (error) {
                handleError(res, error);
            }
        );
});

module.exports = router;
