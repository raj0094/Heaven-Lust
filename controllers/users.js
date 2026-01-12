const User = require("../models/user.js");  

module.exports.renderSignupform = (req,res)=>{  // to send a signup form
    res.render("users/signup.ejs")
}