require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//PASSPORT JS
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");

//ERRORS    
const ExpressError = require("./public/js/ExpressError.js");
//COOKIE
const cookieparser = require("cookie-parser");
app.use(cookieparser("secretcode"));
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
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //USE FOR TAKING FORM DATA AND USE FOR GROUPING FORM NAME LIKE listings[title]
app.use(methodOverride("_method")); //USE FOR OVERRIDING METHODS (PUT,DELETE)
app.engine("ejs", ejsMate); //USE FOR EJS MATE
app.set("view engine", "ejs"); //TELL SERVER TO RENDER EJS FILES
app.set("views", path.join(__dirname, "views")); //TELL SERVER WHERE TO FIND EJS FILES
app.use(express.static(path.join(__dirname, "/public")));

const secret = process.env.SECRET || "mysupersecretstring";

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

app.use(session(sessionOptions));
app.use(flash());

// //PASSPORT AUTHENTICATION 
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser()); //TO STORE SERAILZE USERS INTO THE SESSIONS
// passport.deserializeUser(User.deserializeUser());//TO STORE DE SERAILZE USERS INTO THE SESSIONS

mongoose.connect(process.env.ATLASDB_URL).then(() => {
    console.log("DB CONNECTED");
}
).catch((err) => {
    console.log(err);
});

// app.get("/", (req, res) => {
//     res.send("GOTO /listings to see all listings");
// });

//MIDDLEWARE FOR FLASH MESSAGE
// Decode token for all requests to display user in navbar
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

//           User makes request
//                  ↓
//           This middleware
//                  ↓
//          Get JWT from cookie
//                  ↓
//           Does JWT exist?
//             /          \
//           YES           NO
//            ↓             ↓
//       jwt.verify()   req.user = null
//            ↓
//       Valid JWT?
//        /       \
//      YES       NO
//       ↓         ↓
// req.user =    req.user = null
// verifiedUser
//       \         /
//        \       /
//         ↓     ↓
//   res.locals.currUser
//   res.locals.successMsg
//   res.locals.errorMsg
//             ↓
//           next()
//             ↓
//          Route/EJS


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


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`SERVER IS LISTENING TO PORT ${port}`);
});