const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

// username and HashedPassword(hashing+salting) automatically created by passport-local-mongoose
UserSchema.plugin(passportLocalMongoose);
const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;