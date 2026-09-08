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

const initDB = async () => {
    await Listing.deleteMany({});
    const initListings = Initdata.data.map((obj) => ({
        ...obj,
        image: typeof obj.image === "object" ? obj.image.url : obj.image,
    }));
    await Listing.insertMany(initListings);
    console.log("DB INITIALIZED");
};