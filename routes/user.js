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

//LOGOUT ROUTE
router.get("/logout", userController.logout);

module.exports = router;