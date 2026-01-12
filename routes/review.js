const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams is required to get :id from listings route

const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/ExpressError.js");

// Models
const listning = require("../models/listing.js");  //  Correct import for Listing
const Review = require("../models/review.js");

const ReviewControllers = require("../controllers/reviews.js");

// Joi schema for server-side validation
const { reviewSchema } = require("../schema.js");

// --------------------------------------------
// Server-side validation middleware using Joi
// --------------------------------------------
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new expressError(error.details[0].message, 400);
    }
    next();
};

// --------------------------------------------
// CREATE REVIEW
// POST /listings/:id/reviews
// --------------------------------------------
router.post("/", validateReview, wrapAsync(ReviewControllers.createReview));

// --------------------------------------------
// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
// --------------------------------------------
router.delete("/:reviewId", wrapAsync(ReviewControllers.deleteReview));

module.exports = router;
