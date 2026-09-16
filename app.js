const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//ERRORS
const ExpressError = require("./public/js/ExpressError.js");
//COOKIE
const cookieparser = require("cookie-parser");
app.use(cookieparser("secretcode"));
//SESSION
const session = require("express-session");
//FLASH
const flash = require("express-flash");
//ROUTES
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //USE FOR TAKING FORM DATA AND USE FOR GROUPING FORM NAME LIKE listings[title]
app.use(methodOverride("_method")); //USE FOR OVERRIDING METHODS (PUT,DELETE)
app.engine("ejs", ejsMate); //USE FOR EJS MATE
app.set("view engine", "ejs"); //TELL SERVER TO RENDER EJS FILES
app.set("views", path.join(__dirname, "views")); //TELL SERVER WHERE TO FIND EJS FILES
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash());

mongoose.connect("mongodb://localhost:27017/airbnb").then(() => {
    console.log("DB CONNECTED");
}
).catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("GOTO /listings to see all listings");
});

//COOKIES TRIAL
app.get("/register", (req, res) => {
    let { name = "ananomus" } = req.query;
    req.session.name = name;
    req.flash("success", "REGISTRATION SUCCESSFULL");
    res.redirect("/hello");
});
app.get("/hello", (req, res) => {
    res.render("listings/page.ejs", { name: req.session.name, msg: req.flash("success") });
});
// app.get("/test", (req, res) => {
//     res.send("TEST SUCCESSFULL");
// });
// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("RESPONSE SEND");
// });
// app.get("/signedcookies", (req, res) => {
//     res.cookie("greet", "namaste", { signed: true });
//     res.cookie("hi", "khatri", { signed: true });
//     res.cookie("love", "19", { maxAge: 199999 });
//     res.send("SENT YOU SIGNED COOKIES");
// });

// app.get("/getcookies", (req, res) => {
//     res.cookie("madein", "India");
//     res.cookie("greet", "namaste");
//     res.cookie("age", "21");
//     let { khatri = "hii" } = req.cookies;
//     console.dir(req.cookies);
//     res.send(`SENT YOU SOME COOKIES ${khatri}`);
// });

// app.get("/clear", (req, res) => {
//     res.clearCookie("age");
//     res.send("cookie cleared");
// })

// LISTINGS ROUTE
app.use("/listings", listings);

// REVIEWS ROUTE
app.use("/listings/:id/reviews", reviews);

//PAGE NOT FOUND HANDLER
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/error.ejs", { err });
});


app.listen(8080, () => {
    console.log("SERVER IS LISTNING TO PORT 8080");
});