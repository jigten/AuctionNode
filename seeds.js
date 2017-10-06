var mongoose = require("mongoose")
var PropItem = require("./models/prop")
var Comment = require("./models/comment")

var data = [
    {
        name: "Nike Air Mags",
        image: "https://mgtvwcmh.files.wordpress.com/2016/10/img_0037.jpg",
        description: "Air Mags are the self lacing shoes that are worn by Marty McFly in Back To The Future 2",
        startingBid: 9000,
    },
    {
        name: "Belle's dress",
        image: "https://www.dhresource.com/600x600/f2/albu/g5/M00/19/6F/rBVaI1jTjDyAHAOuAAW60_EjGQs999.jpg",
        description: "Belle's (Emma Watson) yellow ball dress worn in the Beauty and the Beast movie",
        startingBid: 2500,
    },
]

function seedDB() {
    // Remove existing all campgrounds
    PropItem.remove({}, function(err) {
        if(err) {
            console.log(err)
        }
        console.log("Removed prop items")
        // after removing, add a few props
        data.forEach(function(seed) {
            PropItem.create(seed, function(err, propItem) {
                if(err) {
                    console.log(err)
                } else {
                    console.log("Added a prop item")
                    // create a comment
                    Comment.create(
                        {
                            text: "What are the items condition?",
                            author: "Homer"
                        }, function (err, comment) {
                            if(err) {
                                console.log(err)
                            } else {
                                propItem.comments.push(comment)
                                propItem.save()
                                console.log("Created new comment")
                            }
                        })
                }
            })
        })
    })
}

module.exports = seedDB
