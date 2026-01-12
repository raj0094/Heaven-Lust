const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const expressError = require("../utils/ExpressError.js");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    console.log(`POST /listings/${id}/reviews called`);

    // Find associated listing
    const listing = await Listing.findById(id);
    if (!listing) throw new expressError("Listing not found", 404);

    // Create new review
    const newReview = new Review(req.body.review);

    // Add review _id to Listing's reviews array
    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove review reference from Listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the Review document
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}