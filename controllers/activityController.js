var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

var ActivityModel = require("../models/activityModel");
var UserModel = require("../models/userModel");

var ActivityController = {
    getActivities: function (startDate, endDate) {
        return ActivityModel
            .find({
                date: { $gte: startDate || new Date(0), $lte: endDate || new Date(8640000000000000) }
            })
            .sort({ date: 1 })
            .exec();
    },

    saveActivity: function (activityData) {
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