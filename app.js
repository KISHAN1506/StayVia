if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { stat } = require("fs");
const { valid } = require("joi");
const { log } = require("console");
const session = require("express-session"); // these store data locally so thereby we are using connect mongo
const MongoStore = require("connect-mongo").default
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

// No longer required as we have restructured everything in routes
// const Listing = require("./models/listing.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/stayvia";
const mongodbAtlasURL = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(mongodbAtlasURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : mongodbAtlasURL,
    crypto :{
        secret:process.env.SECRET,
    },
    touchAfter: 24*60*60
})

store.on("error",() =>{
    console.log("Error in MONGO session store");
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*25*60*60*1000,
        maxAge: 7*25*60*60*1000,
        httpOnly: true,
    }
};

app.get("/", (req, res) => {
    res.redirect("/listings")
})

app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); //if next not called so we'll be stuck at this middleware itself
})

app.get("/terms", (req, res) => {
    res.render("terms");
});

// app.get("/fakeUser",async (req,res)=>{
//     let fakeUser = new User({
//         email : "Kishan@gmail.com",
//         username : "Kishan1506",
//     });

//     let registeredUser = await User.register(fakeUser,"kishanismyname");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// instead of all and * just use and none
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
})


const port = 8080;
app.listen(port, () => {
    console.log("Server is listening to port 8080");
})