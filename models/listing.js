const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js'); // Review model for reference

// ----------------------------------------------------
// Listing Schema
// Each listing can have multiple reviews (one-to-many)
// ----------------------------------------------------
const listingSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },

    // Image object with default values
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a"
        }
    },

    price: { 
        type: Number, 
        required: true 
    },
    location: String,
    country: String,

    // Optional geographic coordinates for the listing (latitude/longitude)
    latitude: Number,
    longitude: Number,

    // ----------------------------------------------------
    // Reviews field: stores ObjectIds of Review documents
    // This is needed for Mongoose populate() in show route
    // ----------------------------------------------------
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    //a dding owner field to listing to know which user created which listing
    owner :{
        type :  Schema.Types.ObjectId,
        ref : "User"

    }
});

// ----------------------------------------------------
// Middleware: delete all reviews when a listing is deleted
// ----------------------------------------------------
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        // Delete all reviews whose _id is in listing.reviews array
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

// ----------------------------------------------------
// Create and export Listing model
// ----------------------------------------------------
const Listing = mongoose.model('listning', listingSchema);
module.exports = Listing;
