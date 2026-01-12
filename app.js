if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}




// ================= BASIC SETUP =================

const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
// for authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//=======SESSION SETUP===========

// const store = MongoStore.create({
//     mongoUrl : process.env.ATLASDB_URL,
//     crypto :{
//         secret : "mysecretcode"
//     },
//     touchAfter : 24*60*60 // time period in seconds
// });

const sessionOption ={secret:process.env.SESSION_SECRET,
    
    resave : false,
    saveUninitialized : true,
    cookie:{
        expire : Date.now() + 7*24*60*60*1000, // cookie will expire in 7 days
        maxAge : 7*24*60*60*1000 ,// cookie will be valid for 7 days
        maxAge : 7*24*60*60*1000 ,// cookie will be valid for 7 days
        httpOnly : true, // cookie cannot be accessed by client side script

    }

}











app.use(session(sessionOption));
app.use(flash());

//passport implementation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



























// Custom error class
const ExpressError = require("./utils/ExpressError.js");

// Route files
const listingsrouter = require("./routes/listings.js");
const reviewsrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");


// ================= VIEW ENGINE SETUP =================

// set ejs as view engine
app.set("view engine", "ejs");

// set views folder path
app.set("views", path.join(__dirname, "views"));

// use ejs-mate for layouts / boilerplate
app.engine("ejs", ejsMate);


// ================= MIDDLEWARE =================

// parse form data (req.body)
app.use(express.urlencoded({ extended: true }));

// serve static files (css, js, images)
app.use(express.static(path.join(__dirname, "public")));

// allow PUT & DELETE using ?_method
app.use(methodOverride("_method"));


// ================= DATABASE CONNECTION =================
// const mongourl = "mongodb://127.0.0.1:27017/heaven";
const dbUrl = process.env.ATLASDB_URL;
main()
    .then(() => console.log("connected successfully!!"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// middleware to pass flash messages to all templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // to access current logged in user in all ejs templates
    // expose Google Maps API key to templates (if present)
    res.locals.MAP_TOKEN = process.env.MAP_TOKEN;
    next();
});



// demo for auth
// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@example.com",
//         username :"rajkishor0094"
//     })

//     let registeruser = await User.register(fakeUser, "hello123");
//     res.send(registeruser)
// })



// ================= ROUTES =================

// listing routes
// example: /listings, /listings/:id, /listings/new
app.use("/listings", listingsrouter);

// review routes (nested route)
// example: /listings/:id/reviews
app.use("/listings/:id/reviews", reviewsrouter);

// user routes
app.use("/", userrouter);


// ================= HOME ROUTE =================

// home page
app.get("/", (req, res) => {
    res.redirect("/listings");
});


// ================= 404 HANDLER =================

// runs when no route matches
app.use((req, res, next) => {
    next(new ExpressError("Page not found !!", 404));
});


// ================= ERROR HANDLING MIDDLEWARE =================

// global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong !!" } = err;
    console.log(err);
    res.status(statusCode).render("./listing/err.ejs", { message });
});


// ================= SERVER START =================

app.listen(port, () => {
    console.log("server is listening !!");
});
