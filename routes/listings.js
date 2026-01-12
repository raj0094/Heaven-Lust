const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedin } = require("../middleware.js");


const Listing = require("../models/listing.js");
const { populate } = require("../models/review.js");
const listingController = require("../controllers/listing.js");
const WrapAsync = require("../utils/wrapAsync.js");


// ================= JOI VALIDATION MIDDLEWARE =================
const validateListing = (req, res, next) => {
    const payload = req.body || {};
    let dataToValidate = payload.listing ? payload.listing : payload;
    if (typeof dataToValidate !== 'object' || Array.isArray(dataToValidate)) {
        console.warn('validateListing: unexpected payload type:', typeof dataToValidate, dataToValidate);
        dataToValidate = {};
    }
    const { error } = listingSchema.validate(dataToValidate, { abortEarly: false, allowUnknown: true, convert: true });
    if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        console.error('Listing validation failed:', messages, 'payload:', dataToValidate);
        throw new ExpressError(messages, 400);
    }
    next();
};



// ================= INDEX ROUTE =================
// GET /listings → show all listings
router.get("/", wrapAsync(listingController.index));


// ================= NEW FORM ROUTE =================
// GET /listings/new → show create form
// IMPORTANT: this must be ABOVE `/:id`
router.get("/new", isLoggedin, listingController.newForm);


// ================= CREATE ROUTE =================
// POST /listings → create new listing
router.post("/", isLoggedin, validateListing, wrapAsync(listingController.createnewlisting));


// ================= EDIT FORM ROUTE =================
// GET /listings/:id/edit → show edit form
router.get("/:id/edit", wrapAsync(listingController.editlisting));


// ================= UPDATE ROUTE =================
// PUT /listings/:id → update listing
router.put("/:id", validateListing, wrapAsync(listingController.updatelistng));


// ================= DELETE ROUTE =================
// DELETE /listings/:id → delete listing
router.delete("/:id", wrapAsync(listingController.deletelisting));


// ================= SHOW ROUTE =================
// GET /listings/:id → show single listing
// IMPORTANT: this must be LAST
router.get("/:id", wrapAsync(listingController.showlisting));


module.exports = router;
