var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return regex.test(v);
            },
            message: "{VALUE} is not a valid email address"
        }
    },
    name: { type: String, required: true }
});

userSchema.plugin(passportLocalMongoose);

var UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;