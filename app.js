const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  moment = require("moment"),
  Agenda = require("agenda")
  PropItem = require("./models/prop"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds")

// requiring ROUTEs
const commentRoutes = require("./routes/comments")
      propItemRoutes = require("./routes/props")
      indexRoutes = require("./routes/index")

// mongoose.connect("mongodb://localhost/tiska")
mongoose.connect("mongodb://jigten:awazache@ds111876.mlab.com:11876/tiska")

const agenda = new Agenda({db: {address: "mongodb://jigten:awazache@ds111876.mlab.com:11876/tiska"}})
agenda.define('expire items', {priority: 'high', concurrency: 1}, function(job, done) {
  // .. do your db query to reduce the price here
  PropItem.find({}, (err, props) => {
    props.forEach((prop) => {
      if(prop.expiryDate <= (Date.now()/1000)) {
        PropItem.findByIdAndUpdate(prop._id, {$set: { expired: true }})
        .then(() => console.log(prop.name, "expired"))
      }
    })
  })
  done(); // dont forget to call done!
});

agenda.on('ready', function() {
  agenda.every('1 minutes', 'expire items');
  agenda.start();
});

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname+ "/public"))
// seedDB()

// Passport Configuration
app.use(require("express-session")({
    secret: "Auction auction",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    // whatever we put in locals is available in all our templates
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.use("/", indexRoutes)
app.use("/props", propItemRoutes)
app.use("/props/:id/comments", commentRoutes)

app.listen(process.env.PORT, process.env.IP, () => {
  console.log("Server up...")
})
