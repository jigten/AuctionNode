const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  PropItem = require("./models/prop"),
  Comment = require("./models/comment"),
  seedDB = require("./seeds")

mongoose.connect("mongodb://localhost/tiska")
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname+ "/public"))
seedDB()

app.get("/", function(req, res) {
  res.render("landing")
})

// Routes

//  INDEX - show all props
app.get("/props", function(req, res) {
  PropItem.find({}, (err, props) => {
      if(err) {
        console.log(err)
      } else {
        res.render("propItems/index", {props})
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
    const newProp = {name, image, description, startingBid, currentBid}

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
      res.render("propItems/show", {propItem})
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
      res.redirect("/props")
    })
})

// COMMENT Routes
app.get("/props/:id/comments/new", (req, res) => {
    PropItem.findById(req.params.id, function(err, propItem) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {propItem});
       }
    });
});

app.post("/props/:id/comments", (req, res) => {
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


app.listen(3000, () => {
  console.log("Server running on port 3000...")
})
