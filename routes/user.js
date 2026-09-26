const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const WrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//for ("/signup")
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(WrapAsync(userController.signup));

//for ("/login")
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, WrapAsync(userController.login));

//TO AUTHENTICATE THE USER WE USE THE MIDDLEWARE passport.authenticate
//TO STORE THE USERS INTO THE SESSION WE USE THE MIDDLEWARE req.login
//if the authentication is successfull then the passport clear all the data stored in the session (so we save the redirectUrl in the locals)
//when a user login in normally via /login, passport.authenticate automatically calls req.login()
//LOGOUT ROUTE
router.get("/logout", userController.logout);

module.exports = router;