require('dotenv').config();

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
app.use(cookieparser(process.env.COOKIE_SECRET));

//SESSION
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
//FLASH
const flash = require("express-flash");
//ROUTES
const listingsRouters = require("./routes/listing.js");
const reviewsRouters = require("./routes/review.js");
const userRouter = require("./routes/user.js");
//JWT
const jwt = require("jsonwebtoken");

//MIDDLEWARE
app.use(express.json()); // USE FOR TAKING JSON DATA AND CONVERT TO JS OBJECT
app.use(express.urlencoded({ extended: true })); //USE FOR TAKING FORM DATA AND USE FOR GROUPING FORM NAME LIKE listings[title]
app.use(methodOverride("_method")); //USE FOR OVERRIDING METHODS (PUT,DELETE)

//TEMPLATE ENGINE
app.engine("ejs", ejsMate); //USE FOR EJS MATE
app.set("view engine", "ejs"); //TELL SERVER TO RENDER EJS FILES
app.set("views", path.join(__dirname, "views")); //TELL SERVER WHERE TO FIND EJS FILES

//STATIC FILES
app.use(express.static(path.join(__dirname, "/public")));

const secret = process.env.SECRET || "mysupersecretstring"; //SECRET FOR SIGNING THE SESSION

//SEE THE STORE OBJECT IN THE MONGO DB AFTER RUNNING THE SERVER
const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: secret,
    },
    touchAfter: 24 * 60 * 60, // time (in seconds) to "touch" a session to avoid re-saving
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //WHEN SHOULD SESSION EXPIRE
        maxAge: 7 * 24 * 60 * 60 * 1000, //HOW LONG THE COOKIE SHOULD LIVE
        httpOnly: true, //CAN'T ACCESS COOKIE FROM CLIENT SIDE
    }
};

//SEE THE SESSION AND REMOVE THIS LINE AFTER COMPLTE SESSION
app.use(session(sessionOptions));
app.use(flash());

mongoose.connect(process.env.ATLASDB_URL).then(() => {
    console.log("DB CONNECTED");
}
).catch((err) => {
    console.log(err);
});

//MIDDLEWARE FOR FLASH MESSAGE
// THIS MIDDLEWARE RUNS EVERY TIME BECAUSE IT HAS NO SPECIFIC PATH
app.use((req, res, next) => {
    const jwtToken = req.cookies.jwt;
    if (jwtToken) {
        try {
            const verifiedUser = jwt.verify(jwtToken, process.env.JWT_SECRET);
            req.user = verifiedUser;
        } catch (err) {
            req.user = null;
            console.log(err);
        }
    } else {
        req.user = null;
    }
    res.locals.currUser = req.user;
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

// LISTINGS ROUTE
app.use("/listings", listingsRouters);

// REVIEWS ROUTE
app.use("/listings/:id/reviews", reviewsRouters);

//USER ROUTE
app.use("/", userRouter);

//PAGE NOT FOUND HANDLER
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/error.ejs", { err });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`SERVER IS LISTENING TO PORT ${PORT}`);
});