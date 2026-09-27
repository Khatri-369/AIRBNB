const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

//PHOTO UPLOADING
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//FOR ("/")
router.route("/")
    .get(wrapAsync(listingController.index)) //SHOW ALL
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing) //CREATE
    );

// NEW ROUTE
router.route("/new")
    .get(isLoggedIn, listingController.renderNewForm);

// FOR("/:id")
router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //SHOW
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) //UPDATE
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); //DELETE

// EDIT ROUTE
router.route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(listingController.editListing)); //EDIT

module.exports = router;