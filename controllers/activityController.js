var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

var ActivityModel = require("../models/activityModel");
var UserModel = require("../models/userModel");

var ActivityController = {
    getActivities: function (startDate, endDate) {
        return ActivityModel.find().exec();
    },

    saveActivity: function (activityData) {
        console.log("saving activity:", activityData);

        if (!activityData) {
            mongoose.Promise.resolve(null);
        }

        return UserModel.findOne({ name: "Administrator" }).exec().then(
            function (user) {
                var activity = new ActivityModel({
                    date: new Date(activityData.date),
                    name: activityData.name,
                    duration: parseInt(activityData.duration),
                    milestones: activityData.milestones,
                    user: user._id
                });
                return activity.save();
            },
            function (error) {
                throw error;
            }
        );
    }
};

module.exports = ActivityController;