const express = require("express"),
  router = express.Router(),
  PropItem = require("../models/prop"),
  moment = require("moment")

//  INDEX - show all props
router.get("/", function(req, res) {
  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi')
    PropItem.find({name: regex}, (err, props) => {
        if(err) {
          console.log(err)
        } else {
          res.render("propItems/index", {props, moment})
        }
    })
  } else {
    PropItem.find({}, (err, props) => {
        if(err) {
          console.log(err)
        } else {
          res.render("propItems/index", {props, moment})
        }
    })
  }
})

// NEW
router.get("/new", isLoggedIn, function (req, res) {
   res.render("propItems/new")
});

// CREATE
router.post("/", isLoggedIn, function (req, res) {
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

router.get("/:id/bid", isLoggedIn, (req,res) => {
  PropItem.findById(req.params.id, (err, propItem) => {
    if(err) {
      console.log(err)
    } else {
      res.render("propItems/bid", {propItem, changeHandler: "detectChange();"})
    }
  })
})

router.post("/:id/bid", isLoggedIn, (req,res) => {
  const currentBid = req.body.amount
  const highestBidder = {
    id: req.user._id,
    username: req.user.username
  }
  PropItem.findByIdAndUpdate(req.params.id, {$set: { currentBid, highestBidder }})
    .then(() => {
      res.redirect(`/props/${req.params.id}`)
    })
})

router.get("/:id/checkout", (req,res) => {
  PropItem.findById(req.params.id, (err, propItem) => {
    if(err) {
      console.log(err)
    } else {
      res.render("propItems/checkout", {propItem})
    }
  })
})

//  middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router
