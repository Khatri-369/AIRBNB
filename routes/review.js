const express = require("express");
const router = express.Router({ mergeParams: true }); //SEE MERGE PARAMS
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const reviewController = require("../controllers/reviews.js");


// POST REVIEW ROUTE
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE REVIEW ROUTE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;