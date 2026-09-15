const express = require("express");
const router = express.Router({ mergeParams: true }); //SEE MERGE PARAMS
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../public/js/ExpressError.js");
const { reviewSchema } = require("../Schema.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

// REVIEW SCHEMA VALIDATING USING JOI
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};

// POST REVIEW ROUTE
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newreview = new Review(req.body.review);

    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// DELETE REVIEW ROUTE
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
