const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/tiska")
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

// Schema setup
const propItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  startingBid: Number,
})

var PropItem = mongoose.model("PropItem", propItemSchema)

// var props = [
//   { name: "Nike Air Mags", image: "https://mgtvwcmh.files.wordpress.com/2016/10/img_0037.jpg" },
//   { name: "Beauty and the Beast Dress", image: "https://www.dhresource.com/600x600/f2/albu/g5/M00/19/6F/rBVaI1jTjDyAHAOuAAW60_EjGQs999.jpg" }
// ]

app.get("/", function(req, res) {
  res.render("landing")
})

//  INDEX - show all props
app.get("/props", function(req, res) {
  PropItem.find({}, (err, props) => {
      if(err) {
        console.log(err)
      } else {
        res.render("props", {props})
      }
  })
})

app.get("/props/new", function (req, res) {
   res.render("new.ejs")
});

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

app.listen(3000, () => {
  console.log("Server running on port 3000...")
})
