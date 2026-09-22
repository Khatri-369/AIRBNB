const mongoose = require("mongoose");
const review = require("./review.js");
const User = require("./user.js");

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        enum: ["trending", "rooms", "iconic cities", "mountains", "castles", "amazing pools", "camping", "farms", "arctic", "beach", "domes", "boats"],
    }
});

//UNDERSTAND THIS PLZ 
Schema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model("Listing", Schema);
module.exports = Listing;