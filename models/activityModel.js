var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var activitySchema = new Schema({
    date: { type: Date, required: true },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    milestones: { type: Array, default: [] },
    user: { type: Schema.ObjectId, required: true }
});

var ActivityModel = mongoose.model("ActivityModel", activitySchema);

module.exports = ActivityModel;