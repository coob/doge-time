var express = require("express");
var router = express.Router();
var passport = require("passport");
var UserModel = require("../models/userModel");

var handleError = function (res, error) {
    res.status(500).send("So much error.");
    throw error;
};

router.get('/login', function (req, res) {
    res.send("So much login");
});

router.post('/register', function (req, res) {
    UserModel.register(new UserModel({ username: req.body.username }), req.body.password, function (err, account) {
        if (err) {
            return res.send('So much success');
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

module.exports = router;