const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { listingSchema } = require("./Schema.js");

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //USE FOR TAKING FORM DATA AND USE FOR GROUPING FORM NAME LIKE listings[title]
app.use(methodOverride("_method")); //USE FOR OVERRIDING METHODS (PUT,DELETE)
app.engine("ejs", ejsMate); //USE FOR EJS MATE
app.set("view engine", "ejs"); //TELL SERVER TO RENDER EJS FILES
app.set("views", path.join(__dirname, "views")); //TELL SERVER WHERE TO FIND EJS FILES
app.use(express.static(path.join(__dirname, "/public")));

//WRAPASYNC
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./public/js/ExpressError.js");

//MODELS
const Listing = require("./model/listing.js");

mongoose.connect("mongodb://localhost:27017/airbnb").then(() => {
    console.log("DB CONNECTED");
}
).catch((err) => {
    console.log(err);
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
        // next(err); --> Done automatically by Express for synchronous code
    } else {
        next();
    }
};

app.get("/", (req, res) => {
    res.send("GOTO /listings to see all listings");
});

//CREATE ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    console.log(result);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//SHOW ROUTE
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "listing not found"));
    }
    res.render("./listings/show.ejs", { listing });
}));

//UPDATE ROUTE
app.get("/listings/:id/edit", validateListing, wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "SEND VALID DATA");
    // }
    const id = req.params.id;
    const listing = await Listing.findById(id);
    // if (!listing) {
    //     throw new ExpressError(404, "listing not found");
    // }
    res.render("./listings/edit.ejs", { listing });
}));
app.put("/listings/:id", wrapAsync(async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/error.ejs", { err });
});
app.listen(8080, () => {
    console.log("SERVER IS LISTNING TO PORT 8080");
});