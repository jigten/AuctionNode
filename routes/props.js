const express = require("express"),
  router = express.Router(),
  PropItem = require("../models/prop"),
  moment = require("moment")

//  INDEX - show all props
router.get("/", function(req, res) {
  PropItem.find({}, (err, props) => {
      if(err) {
        console.log(err)
      } else {
        res.render("propItems/index", {props, moment})
      }
  })
})

// NEW
router.get("/new", function (req, res) {
   res.render("propItems/new")
});

// CREATE
router.post("/", function (req, res) {
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
router.get("/:id", (req,res) => {
  PropItem.findById(req.params.id).populate("comments").exec((err, propItem) => {
    if(err) {
      console.log(err)
    } else {
      res.render("propItems/show", {propItem, moment})
    }
  })
})

router.get("/:id/bid", (req,res) => {
  PropItem.findById(req.params.id, (err, propItem) => {
    if(err) {
      console.log(err)
    } else {
      res.render("propItems/bid", {propItem, changeHandler: "detectChange();"})
    }
  })
})

router.post("/:id/bid", (req,res) => {
  PropItem.findByIdAndUpdate(req.params.id, {$set: { currentBid: req.body.amount, highestBidder: req.body.user }})
    .then(() => {
      res.redirect(`/props/${req.params.id}`)
    })
})

module.exports = router
