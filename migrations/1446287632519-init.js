var chalk = require("chalk");

var UserModel = require("../models/userModel");
var ActivityModel = require("../models/activityModel");

exports.up = function (next) {
    console.log(chalk.cyan("Initial migration"));

    var adminObjectId = 0;
    var admin = new UserModel({
        email: "admin@dogetime.com",
        name: "Administrator"
    });
    admin.save(function (error, data) {
        if (error) {
            throw error;
        }

        adminObjectId = data._id;

        var zeroActivity = new ActivityModel({
            date: new Date(),
            name: "Zero Activity",
            duration: 5,
            milestones: [],
            user: adminObjectId
        });
        zeroActivity.save(function (error, data) {
            if (error) {
                console.log(error.errors);
                throw error;
            }

            next();
        });

    });
};

exports.down = function (next) {
    next();
};
