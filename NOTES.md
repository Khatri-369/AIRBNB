# 📚 WanderLust Project: Complete Topic-wise Revision Notes

---

## 📑 Table of Contents
1. [Architecture & Request Lifecycle (MVC)](#1-architecture--request-lifecycle-mvc)
2. [Data Input: The Big 3 (`req.params`, `req.query`, `req.body`)](#2-data-input-the-big-3-reqparams-reqquery-reqbody)
3. [Middleware Mechanics: Regular vs Error-Handling](#3-middleware-mechanics-regular-vs-error-handling)
4. [Async Safety Net & Error Handling (`wrapAsync`, `ExpressError`)](#4-async-safety-net--error-handling-wrapasync-expresserror)
5. [Sessions & Persistent State (`express-session`, `connect-mongo`)](#5-sessions--persistent-state-express-session-connect-mongo)
6. [Flash Messages & `res.locals`](#6-flash-messages--reslocals)
7. [Smart Redirection (`saveRedirectUrl`)](#7-smart-redirection-saveredirecturl)
8. [Password Security: Bcrypt & Salt Rounds](#8-password-security-bcrypt--salt-rounds)
9. [Authentication Deep Dive: JWT (JSON Web Tokens)](#9-authentication-deep-dive-jwt-json-web-tokens)
10. [Mongoose Relationships & Population (`populate`, Nested Populate)](#10-mongoose-relationships--population-populate-nested-populate)
11. [Cascading Deletions (`post("findOneAndDelete")`)](#11-cascading-deletions-postfindoneanddelete)
12. [File Uploads: Multer & Cloudinary Storage](#12-file-uploads-multer--cloudinary-storage)
13. [Routing Best Practices (`router.route()`, Route Ordering)](#13-routing-best-practices-routerroute-route-ordering)

---

## 1. Architecture & Request Lifecycle (MVC)

The project follows the **Model - View - Controller (MVC)** architectural design:

```
[ Browser ] ──► (HTTP Request)
     │
     ▼
[ app.js ] ──► Middlewares (cookie-parser, session, flash, currUser)
     │
     ▼
[ routes/ ] ──► Routes match URL path (e.g., /listings)
     │
     ▼
[ controllers/ ] ──► Business logic & Database operations
     ├── Interacts with [ model/ ] (MongoDB Atlas)
     │
     ▼
[ views/ ] ──► Renders dynamic EJS templates (HTML)
     │
     ▼
[ Browser ] ◄── (HTTP Response with rendered HTML)
```

- **Model (`model/`)**: Defines Schema, validations, and database hooks (Listing, Review, User).
- **View (`views/`)**: User interface rendered with EJS (`boilerplate.ejs`, `index.ejs`, `show.ejs`).
- **Controller (`controllers/`)**: Handles incoming data, queries database, renders views or redirects.
- **Router (`routes/`)**: Clean URL endpoint mapping.

---

## 2. Data Input: The Big 3 (`req.params`, `req.query`, `req.body`)

| Property | Origin in Request | Example | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **`req.params`** | Route path wildcard (`/:id`) | `/listings/`**`64a7f29b`** | Fetching a specific document by its unique ID |
| **`req.query`** | URL Query String (after `?`) | `/listings?`**`category=beach&search=goa`** | Search bars, category filters, pagination |
| **`req.body`** | Payload inside HTTP Body | `<form>` input fields | Creating or updating documents, submitting credentials |

### Example Code:
```javascript
// 1. req.params
const { id } = req.params;
const listing = await Listing.findById(id);

// 2. req.query
const { category, search } = req.query;
const filtered = await Listing.find({ category });

// 3. req.body (Requires app.use(express.urlencoded({ extended: true })))
const newListing = new Listing(req.body.listing);
```

---

## 3. Middleware Mechanics: Regular vs Error-Handling

Middleware functions are workers on Express's request conveyor belt.

### A. Regular Middleware (3 Arguments: `req, res, next`)
- Runs in sequential order.
- Always calls `next()` to hand off control to the next middleware.
```javascript
app.use((req, res, next) => {
    console.log("Request received at:", Date.now());
    next(); // Pass to next middleware
});
```

### B. Error-Handling Middleware (4 Arguments: `err, req, res, next`)
- **Express detects the 4-parameter signature** (`err, req, res, next`).
- Normal middlewares are skipped automatically when `next(err)` is invoked!
- Catches errors from anywhere in the application:
```javascript
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/error.ejs", { err });
});
```

### The Golden Rule of `next()`:
- `next()` ➔ Moves to the next **regular** middleware.
- `next(err)` ➔ Triggers emergency stop, skips all regular routes, and jumps straight to the **4-argument error handler**.

---

## 4. Async Safety Net & Error Handling (`wrapAsync`, `ExpressError`)

### A. Custom Error Class (`ExpressError.js`)
Extends standard JS Error to include HTTP status codes (`400`, `404`, `500`):
```javascript
class ExpressError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}
```

### B. Async Wrapper (`wrapAsync.js`)
Without `wrapAsync`, an error inside an `async/await` route will cause Express to hang or crash:
```javascript
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
}
```
**Usage in routes:**
```javascript
router.get("/:id", wrapAsync(listingController.showListing));
```

---

## 5. Sessions & Persistent State (`express-session`, `connect-mongo`)

### The Concept: "The Coat-Check / Locker Key"
HTTP is stateless. Sessions allow the server to remember a user across multiple requests.

```
Browser holds Cookie (Locker Key):       MongoDB Atlas holds Data (Locker):
connect.sid = "s%3A_WWyl..."       ──►   {
                                           redirectUrl: "/listings/new",
                                           flash: { success: [...] }
                                         }
```

### Why MongoStore instead of Default Memory?
- Default memory store leaks memory and loses all sessions when the server restarts.
- `connect-mongo` stores sessions persistently in the `sessions` collection in MongoDB Atlas.

### Configuration (`app.js`):
```javascript
const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: { secret: process.env.SECRET },
    touchAfter: 24 * 60 * 60, // Don't re-save if unmodified for 24h
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // XSS protection (JS cannot access cookie)
    }
};
app.use(session(sessionOptions));
```

---

## 6. Flash Messages & `res.locals`

Flash messages are temporary notifications displayed to the user right after a redirect.

### How Flash Works:
1. `req.flash("success", "Listing created!")`: Saved into `req.session.flash`.
2. Browser redirects to the new page.
3. Message is read, sent to view, and **immediately deleted from session**.

### Bridging to Views with `res.locals`:
Variables attached to `res.locals` are automatically accessible in **all EJS templates** without manually passing them in `res.render()`!

```javascript
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user; // User object for navbar login/logout state
    next();
});
```

---

## 7. Smart Redirection (`saveRedirectUrl`)

Ensures users who are forced to log in get returned to the page they were originally trying to access (e.g. `/listings/new`).

### The 4 Steps:
1. User clicks `/listings/new` (Protected page).
2. `isLoggedIn` middleware runs:
   ```javascript
   req.session.redirectUrl = req.originalUrl; // Saves "/listings/new"
   res.redirect("/login");
   ```
3. User submits login form (`POST /login`):
   `saveRedirectUrl` runs before controller:
   ```javascript
   if (req.session.redirectUrl) {
       res.locals.redirectUrl = req.session.redirectUrl;
   }
   ```
4. Login controller redirects user:
   ```javascript
   const redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl); // Back to /listings/new!
   ```

---

## 8. Password Security: Bcrypt & Salt Rounds

Never store passwords as plain text in the database.

### Definitions:
- **Encoding**: Format conversion (e.g. Base64). No security. Reversible without key.
- **Encryption**: Two-way secret cipher. Reversible with key.
- **Hashing**: One-way mathematical fingerprint. Cannot be reversed.

### How Bcrypt Works in `model/user.js`:
```javascript
// Automatically hashes password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(12); // Cost factor: 12 rounds
    this.password = await bcrypt.hash(this.password, salt);
});

// Helper instance method to verify password at login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
```

---

## 9. Authentication Deep Dive: JWT (JSON Web Tokens)

JWT is a stateless authentication mechanism composed of:
`Header.Payload.Signature`

### A. `jwt.sign(payload, secret, options)`
Creates the signed token upon successful signup or login:
```javascript
const token = jwt.sign(
    { _id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);

// Stored in secure HTTP-only cookie
res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

### B. Global Request Interceptor (`app.js`):
Runs on every request to check if a user is logged in:
```javascript
app.use((req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    res.locals.currUser = req.user;
    next();
});
```

### C. Route Guard (`middleware.js: isLoggedIn`):
```javascript
module.exports.isLoggedIn = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.clearCookie("jwt");
        req.flash("error", "Invalid token");
        return res.redirect("/login");
    }
};
```

---

## 10. Mongoose Relationships & Population (`populate`, Nested Populate)

In MongoDB, relationships are stored as `ObjectId` references:
```javascript
// model/listing.js
reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
owner: { type: Schema.Types.ObjectId, ref: "User" }
```

### Why Populate?
Raw MongoDB documents only have IDs (e.g. `owner: "64a100..."`). `.populate()` replaces those IDs with actual document objects!

### Nested Populate in `controllers/listings.js:54`:
```javascript
const listing = await Listing.findById(id)
    .populate({
        path: "reviews",                // Level 1: Get review documents
        populate: { path: "author" }    // Level 2: Get user document of review author
    })
    .populate("owner");                 // Level 1: Get listing owner document
```

---

## 11. Cascading Deletions (`post("findOneAndDelete")`)

### The Problem: Orphaned Reviews
Deleting a Listing shouldn't leave its reviews floating in MongoDB forever.

### The Solution in `model/listing.js`:
```javascript
Schema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        // Delete all reviews whose _id is present inside listing.reviews array
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
```
- Triggered automatically when calling `Listing.findByIdAndDelete(id)`.
- `$in` matches any document with an ID inside the `listing.reviews` array.

---

## 12. File Uploads: Multer & Cloudinary Storage

HTML forms cannot send binary files using regular urlencoding.

### Architecture:
```
[ Form enctype="multipart/form-data" ]
              │
              ▼
[ multer({ storage: CloudinaryStorage }) ]
              ├── Streams file directly to Cloudinary
              │
              ▼
[ req.file ]  ──► { path: "https://res.cloudinary...", filename: "wanderlust_DEV/..." }
[ req.body ]  ──► Text inputs { title, price, location, ... }
```

### Configuration (`cloudConfig.js`):
```javascript
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust_DEV",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});
```

### Saving to MongoDB (`controllers/listings.js`):
```javascript
let url = req.file.path;         // HTTPS link from Cloudinary
let filename = req.file.filename; // Cloudinary identifier
newListing.image = { url, filename };
await newListing.save();
```

---

## 13. Routing Best Practices (`router.route()`, Route Ordering)

### A. Chaining HTTP Verbs with `router.route()`
Combines multiple methods on the same path:
```javascript
router.route("/")
    .get(wrapAsync(listingController.index))   // Read all
    .post(isLoggedIn, wrapAsync(listingController.createListing)); // Create
```

### B. Route Ordering Rule (`/new` vs `/:id`)
Always define static routes like `/new` **BEFORE** dynamic routes like `/:id`!

```javascript
// ✅ CORRECT ORDER:
router.get("/new", ...); // Matches /listings/new
router.get("/:id", ...); // Matches /listings/64a100

// ❌ WRONG ORDER:
router.get("/:id", ...); 
router.get("/new", ...); // NEVER REACHED! "new" gets treated as an ID, causing CastError!
```