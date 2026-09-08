const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //USE FOR TAKING FORM DATA AND USE FOR GROUPING FORM NAME LIKE listings[title]
app.use(methodOverride("_method")); //USE FOR OVERRIDING METHODS (PUT,DELETE)
app.engine("ejs", ejsMate); //USE FOR EJS MATE
app.set("view engine", "ejs"); //TELL SERVER TO RENDER EJS FILES
app.set("views", path.join(__dirname, "views")); //TELL SERVER WHERE TO FIND EJS FILES
app.use(express.static(path.join(__dirname, "/public")));

//MODELS
const Listing = require("./model/listing.js");

mongoose.connect("mongodb://localhost:27017/airbnb").then(() => {
    console.log("DB CONNECTED");
}
).catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("GOTO /listings to see all listings");
});

//CREATE ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.post("/listings", async (req, res) => {
    let listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
});

//SHOW ROUTE
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});
app.get("/listings/:id", async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
});

//UPDATE ROUTE
app.get("/listings/:id/edit", async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
});
app.put("/listings/:id", async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(8080, () => {
    console.log("SERVER IS LISTNING TO PORT 8080");
});