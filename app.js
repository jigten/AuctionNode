const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  PropItem = require("./models/prop"),
  seedDB = require("./seeds")

mongoose.connect("mongodb://localhost/tiska")
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
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
        res.render("index", {props})
      }
  })
})

// NEW
app.get("/props/new", function (req, res) {
   res.render("new.ejs")
});

// CREATE
app.post("/props", function (req, res) {
    // get data from form and add to props array
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const startingBid = req.body.startingBid
    const newProp = {name, image, description, startingBid}

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
      res.render("show", {propItem})
    }
  })
})

app.listen(3000, () => {
  console.log("Server running on port 3000...")
})
