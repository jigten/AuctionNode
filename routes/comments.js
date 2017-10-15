const express = require("express"),
  router = express.Router({mergeParams: true}),
  PropItem = require("../models/prop"),
  Comment = require("../models/comment")

// COMMENT Routes
router.get("/new", isLoggedIn, (req, res) => {
    PropItem.findById(req.params.id, function(err, propItem) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {propItem})
       }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    PropItem.findById(req.params.id, function(err, propItem) {
       if(err) {
           console.log(err)
           res.redirect("/props")
       } else {
           // create the new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err)
                } else {
                  comment.author.id = req.user._id
                  comment.author.username = req.user.username
                  comment.save()
                  propItem.comments.push(comment)
                  propItem.save()
                  res.redirect("/props/" + propItem._id)
                }
            })
       }
    })
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router
