const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
}



module.exports.newForm = (req, res) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in first!");
        return res.redirect("/login");
    }
    res.render("listing/newform.ejs");
}



module.exports.createnewlisting = (async (req, res) => {
    // Accept either nested `listing` payload or top-level fields
    const data = req.body && req.body.listing ? req.body.listing : (req.body || {});
    // If image was provided as URL string, convert to object expected by model
    if (data.image && typeof data.image === 'string') {
        data.image = { url: data.image };
    }

    const newListing = new Listing(data);
    // accept latitude/longitude from the normalized data
    const lat = data.latitude;
    const lng = data.longitude;
    if (lat) newListing.latitude = parseFloat(lat);
    if (lng) newListing.longitude = parseFloat(lng);
    // set owner if authenticated
    if (req.user && req.user._id) newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new listing created successfully");
    res.redirect("/listings");
})



module.exports.editlisting = async (req, res) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in first!");
        return res.redirect("/login");
    }
    const { id } = req.params;
    const partIdlisting = await Listing.findById(id);
    res.render("listing/edit.ejs", { partIdlisting });
}



module.exports.updatelistng = async (req, res) => {
    const { id } = req.params;
    // Normalize incoming payload
    const payload = req.body && req.body.listing ? req.body.listing : (req.body || {});
    const update = Object.assign({}, payload);
    // If image was provided as URL string, convert to object expected by model
    if (update.image && typeof update.image === 'string') {
        update.image = { url: update.image };
    }
    // support latitude/longitude in normalized payload
    const lat = payload.latitude;
    const lng = payload.longitude;
    if (lat) update.latitude = parseFloat(lat);
    if (lng) update.longitude = parseFloat(lng);

    await Listing.findByIdAndUpdate(id, update, {
        runValidators: true,
        new: true
    });
    res.redirect(`/listings/${id}`);
}



module.exports.deletelisting = async (req, res) => {
     if(!req.isAuthenticated()){
        req.flash("error","You must be logged in first!");
        return res.redirect("/login");
    }
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}



module.exports.showlisting = async (req, res) => {
    const { id } = req.params;
    const partIdlisting = await Listing.findById(id).populate({
  path: "reviews",
  populate: { path: "author" }
})
.populate("owner");
    if (!partIdlisting) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { partIdlisting });
}