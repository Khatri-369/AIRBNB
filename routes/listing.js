const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../public/js/ExpressError.js");
const { listingSchema } = require("../Schema.js");
const Listing = require("../model/listing.js");

// LISTING SCHEMA VALIDATING USING JOI
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};

// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// NEW ROUTE
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// CREATE ROUTE
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id).populate("reviews");
    // CUSTOM ERROR
    if (!listing) {
        return next(new ExpressError(404, "listing not found"));
    }
    res.render("./listings/show.ejs", { listing });
}));

// EDIT ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}));

// UPDATE ROUTE
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
router.delete("/:id", wrapAsync(async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;