var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

var ActivityModel = require("../models/activityModel");
var UserModel = require("../models/userModel");

var ActivityController = {
    getActivity: function (id) {
        return ActivityModel
            .findOne({
                _id: id
            })
            .exec();
    },

    getActivities: function (from, to) {
        return ActivityModel
            .find({
                date: { $gte: from || new Date(0), $lte: to || new Date(8640000000000000) }
            })
            .sort({ date: 1 })
            .exec();
    },

    saveActivity: function (data) {
        if (!data) {
            return mongoose.Promise.resolve(null);
        }

        return UserModel.findOne({ name: "Administrator" }).exec().then(
            function (user) {
                var activity = new ActivityModel({
                    date: new Date(data.date),
                    name: data.name,
                    duration: parseInt(data.duration),
                    milestones: data.milestones,
                    user: user._id
                });
                return activity.save();
            },
            function (error) {
                throw error;
            }
        );
    },

    updateActivity: function (id, data) {
        if (!id || !data) {
            return mongoose.Promise.resolve(null);
        }

        return ActivityModel
            .update({ _id: id }, { $set: data })
            .exec();
    }
};

module.exports = ActivityController;