const Listing = require("./model/listing.js");
const ExpressError = require("./public/js/ExpressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");
const Review = require("./model/review.js");
const jwt = require("jsonwebtoken");

//AUTHENTICATION MIDDLEWARE
module.exports.isLoggedIn = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        // Save the page they were trying to visit into MongoDB session
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    try {
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifiedUser;
        next();
    } catch (error) {
        res.clearCookie("jwt");
        req.flash("error", "Invalid token");
        return res.redirect("/login");
    }
};

// 2. When they submit the login form on POST /login:
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        // Transfer from session to res.locals so the controller can read it
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "ONLY OWNER CAN EDIT LISTINGS");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// LISTING SCHEMA VALIDATING USING JOI
module.exports.validateListing = (req, res, next) => {
    // 1. Validate req.body against Joi schema
    let { error } = listingSchema.validate(req.body);
    if (error) {
        // If invalid: extract error message and pass to error handler
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    } else {
        // If valid: continue to the next function (the controller)
        next();
    }
};

// REVIEW SCHEMA VALIDATING USING JOI
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "YOU ARE NOT AUTHOR OF THIS REVIEW");
        return res.redirect(`/listings/${id}`);
    }
    next();
};