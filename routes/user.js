const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const passport = require("passport");
const WrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");

//SIGNUP ROUTE
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

//SIGNUP POST REQUEST
router.post("/signup", WrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email,
            username
        });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "REGISTER SUCCESSFULLY");
            res.redirect("/listings");
        }); // TO LOGIN THE USER DIRECTLY AFTER SIGNUP IT IS A FUNCTION
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

//LOGIN USER
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

//TO AUTHENTICATE THE USER WE USE THE MIDDLEWARE passport.authenticate
//TO STORE THE USERS INTO THE SESSION WE USE THE MIDDLEWARE req.login
//if the authentication is successfull then the passport clear all the data stored in the session (so we save the redirectUrl in the locals)
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("success", "WELCOME TO WANDERLUST ! You are logged in");
    res.redirect(res.locals.redirectUrl || "/listings");
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out successfully!");
        res.redirect("/listings");
    });
});

module.exports = router;