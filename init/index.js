const mongoose = require("mongoose");
const Initdata = require("./data.js");
const Listing = require("../model/listing.js");

main()
    .then(() => {
        console.log("DB CONNECTED");
        initDB();
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

async function initDB() {
    await Listing.deleteMany({});
    const initListings = Initdata.data.map((obj) => ({
        ...obj,
        owner: "6aaad365ddb5ad5956a41b05"
    }));
    await Listing.insertMany(initListings);
    console.log("DB INITIALIZED");
}