var ActivityModel = require("../models/activityModel");

var ActivityController = {
    getActivities: function (startDate, endDate) {
        return ActivityModel.find(function (error, data) {
            if (error) {
                throw error;
            }

            return data;
        })
    }
};

module.exports = ActivityController;