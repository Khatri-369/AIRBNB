module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path, "||||||||", req.originalUrl);
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}