const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
// aquire model where data will store 
const User = require("../models/user.js");  

const UserController = require("../controllers/users.js")


router.get("/signup",UserController.renderSignupform);  // to send a signup form

// to store actuall data from form

router.post("/signup",async(req,res)=>{
  try{
      let {username,email,password} = req.body;
      const newuser = new User({email,username})

       const registeredUser = await User.register(newuser,password)

       req.login(registeredUser ,(err)=>{   // after signup user is automatically login using req.login
        if(err){
            return next(err);
        }
        req.flash("sucess","Welcome to Heaven lust ")

       res.redirect("/listings")

       })
      
     
    }catch{
        req.flash("error" ,error.message);
        res.redirect("/signup");

    }
    

})


//==============FOR LOGIN ==============

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})



router.post
("/login", passport.authenticate('local',{     // at login time user detail is verify from database is auto done by passport.authenticate
    failureRedirect: '/login' , failureFlash :  true,
})
    
,async(req,res)=>{
    req.flash("sucess","Wlcome to HeavenLust! You are loggedin ! ")
    res.redirect("/listings")


})


//================FOR LOGOUT ===============

router.get("/logout",(req,res)=>{
    req.logout((err)=>{                      // it is inbuild passport logout fux and take it as call b
        if(err){
            return res.redirect("/listings");
        }
        req.flash("success" , "Logout successfully !")
        res.redirect("/listings");
    });        
})
















module.exports = router;