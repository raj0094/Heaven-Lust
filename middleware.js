// to check user is logged in or not
module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {  // it checks whether user is logged in or not
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
}; 