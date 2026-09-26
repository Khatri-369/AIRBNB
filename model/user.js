const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

//HASH PASSWORD BEFORE SAVING(SIGNUP/UPDATE PASSWORD)
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

//HELPER METHOD TO COMPARE PASSWORD(LOGIN)
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;