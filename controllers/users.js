const User = require("../model/user.js");
const jwt = require("jsonwebtoken");

//HELPER FUNCTION TO SIGN AND SET TOKE COOKIE
const sendTokenResponse = (user, req, res, redirectUrl, message) => {
    //MAKE JWT TOKEN
    const token = jwt.sign({
        _id: user._id,
        username: user.username,
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    //Remember: the payload is encoded, not encrypted, so don't put passwords or other secrets here.
    //SAVE IN COOKIE
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //REDIRECT TO PAGE
    req.flash("success", message);
    res.redirect(redirectUrl || "/listings");
}

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        sendTokenResponse(newUser, req, res, "/listings", "Welcome to Wanderlust! Registration successful");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

//LOGIN WITH JWT & PASSWORD VERIFICATION
module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }
        // Compare password using bcrypt
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }
        const redirectUrl = res.locals.redirectUrl || "/listings";
        sendTokenResponse(user, req, res, redirectUrl, "WELCOME TO WANDERLUST! YOU ARE LOGGED IN");
    } catch (err) {
        req.flash("error", "Login failed, please try again.");
        res.redirect("/login");
    }
};

//LOGOUT
module.exports.logout = (req, res) => {
    res.clearCookie("jwt");
    req.flash("success", "You are logged out successfully!");
    res.redirect("/listings");
};