const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../model/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// CREATE LISTINGS
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

// SHOW LISTINGS
router.get("/:id", wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner"); //NESTED POPULATE
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}));

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
}));

// UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;