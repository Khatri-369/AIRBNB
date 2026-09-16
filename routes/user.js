const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const passport = require("passport");
const WrapAsync = require("../utils/wrapAsync.js");

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
        req.flash("success", "REGISTER SUCCESSFULLY");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

//LOGIN USER
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("success", "WELCOME TO WANDERLUST ! You are logged in");
    res.redirect("/listings");
});

module.exports = router;    