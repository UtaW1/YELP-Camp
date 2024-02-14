import {createRequire} from 'module'
const require = createRequire(import.meta.url)
const path = require('path')
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config(); 
}



// boiler plates and imports
import express from 'express'

const mongoose = require('mongoose'); 
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate'); 
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
import { fileURLToPath } from 'url'
import ExpressMongoSanitize from 'express-mongo-sanitize';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename); 
const ExpressError = require('./utilities/expressError.cjs');
const flash = require('connect-flash'); 
const passport = require('passport'); 
const LocalStrategy = require('passport-local'); 
const mongoSanitize = require('express-mongo-sanitize'); 
const helmet = require('helmet'); 


const usersRoute = require('./routes/user.cjs')
const campgroundsRoute = require('./routes/campgrounds.cjs'); 
const reviewsRoute = require('./routes/reviews.cjs')
const User = require('./models/user.cjs')
const databaseUrl = 'mongodb://127.0.0.1:27017/yelp-camp'; 

const store = MongoStore.create({
    mongoUrl: databaseUrl, 
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'supersecret101'
    }
}); 

store.on('error', e => {
    console.log("SESSION STORE ERROR!", e); 
})

//
// 
const app = express(); 
const PORT = 8080; 

// mongoose set up
mongoose.set('strictQuery', true); 
mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error")); 
db.once("open", () => {
    console.log("Database connected!")
})
// 

// express sets and use
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvsz9pudp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs'); 
app.use(express.urlencoded({extended:true})); // for parsing post requests (req.body)
app.use(methodOverride('_method')); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(flash()); 
app.use(ExpressMongoSanitize({
    replaceWith: '_urmom' 
}
)); 



const sessionConfig = {
    store, 
    name: 'jizzler_', 
    secret: 'thisshouldbeabettersecret', 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true, 
        // secure: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig)) // we have to make sure our express session is before our passport session or there will be conflicts
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); // how to store a user in our db
passport.deserializeUser(User.deserializeUser()); // how to un-store a user in our db


app.use((req,res,next) => { // run on every req 
    res.locals.currentUser = req.user; // passport made feature it will send us a user object, it will be undefined if there's no user
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error');
    next(); 
})
//


// routes

app.use('/campgrounds', campgroundsRoute); // the beginning / will be the prefix so we have to be careful and check that we don't have the same thing in our route file
app.use('/campgrounds/:id/reviews', reviewsRoute); 
app.use('/', usersRoute); 
app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err; 
    if(!err.message) err.message = 'Oh no, Something Went Wrong!'; 
    res.status(statusCode).render('error', { err }); 
    
})


app.listen(PORT, () => {
    console.log(`Express listening on port ${PORT}`)
})