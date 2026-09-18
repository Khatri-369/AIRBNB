const Listing = require("./model/listing.js");
const ExpressError = require("./public/js/ExpressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");
const Review = require("./model/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //REDIRECT URL
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

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
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    } else {
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
    let { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "YOU ARE NOT AUTHOR OF THIS REVIEW");
        return res.redirect(`/listings/${id}`);
    }
    next();
};