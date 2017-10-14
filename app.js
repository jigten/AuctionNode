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

mongoose.connect("mongodb://localhost/tiska")

const agenda = new Agenda({db: {address: "mongodb://localhost/tiska"}})
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
seedDB()

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

app.get("/", function(req, res) {
  res.render("landing")
})

//  INDEX - show all props
app.get("/props", function(req, res) {
  PropItem.find({}, (err, props) => {
      if(err) {
        console.log(err)
      } else {
        res.render("propItems/index", {props, moment})
      }
  })
})

// NEW
app.get("/props/new", function (req, res) {
   res.render("propItems/new")
});

// CREATE
app.post("/props", function (req, res) {
    // get data from form and add to props array
    const name = req.body.name;
    const image = [
      req.body.image1,
      req.body.image2,
      req.body.image3,
    ]
    const description = req.body.description;
    const startingBid = req.body.startingBid
    const currentBid = req.body.startingBid
    const expiryDate = new Date(req.body.expiryDate).getTime() / 1000
    const newProp = {name, image, description, startingBid, currentBid, expiryDate}

    PropItem.create(newProp, (err, createdProp) => {
      if(err) {
        console.log(err)
      } else {
        // redirect back to campgrounds page
        res.redirect("/props")
      }
    })
})
// SHOW
app.get("/props/:id", (req,res) => {
  PropItem.findById(req.params.id).populate("comments").exec((err, propItem) => {
    if(err) {
      console.log(err)
    } else {
      res.render("propItems/show", {propItem, moment})
    }
  })
})

app.get("/props/:id/bid", (req,res) => {
  PropItem.findById(req.params.id, (err, propItem) => {
    if(err) {
      console.log(err)
    } else {
      res.render("propItems/bid", {propItem, changeHandler: "detectChange();"})
    }
  })
})

app.post("/props/:id/bid", (req,res) => {
  PropItem.findByIdAndUpdate(req.params.id, {$set: { currentBid: req.body.amount, highestBidder: req.body.user }})
    .then(() => {
      res.redirect(`/props/${req.params.id}`)
    })
})

// COMMENT Routes
app.get("/props/:id/comments/new", isLoggedIn, (req, res) => {
    PropItem.findById(req.params.id, function(err, propItem) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {propItem});
       }
    });
});

app.post("/props/:id/comments", isLoggedIn, (req, res) => {
    PropItem.findById(req.params.id, function(err, propItem) {
       if(err) {
           console.log(err);
           res.redirect("/props");
       } else {
           // create the new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    propItem.comments.push(comment);
                    propItem.save();
                    res.redirect("/props/" + propItem._id);
                }
            });
       }
    });
});

// AUTH ROUTEs

// show register form
app.get("/register", function(req, res) {
    res.render("register")
})

// handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function (err, user) {
       if(err) {
           console.log(err)
           return res.render("register")
       }
       passport.authenticate("local")(req, res, function() {
           res.redirect("/props")
       })
    });
});

// show login form
app.get("/login", function (req, res) {
   res.render("login")
});

// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/props",
        failureRedirect: "/login"
    }), function (req, res) {
});

// logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/props");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, () => {
  console.log("Server running on port 3000...")
})
