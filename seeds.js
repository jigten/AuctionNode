var mongoose = require("mongoose")
var PropItem = require("./models/prop")
var Comment = require("./models/comment")

var data = [
    {
        name: "Nike Air Mags",
        image: [
          "https://mgtvwcmh.files.wordpress.com/2016/10/img_0037.jpg",
          "https://i.pinimg.com/564x/56/b2/a3/56b2a37f22f85f2bff1fae3f5944db7a--nike-air-mag-marty-mcfly.jpg",
          "https://cdn.kickgame.co.uk/image/cache/data/air%20mag/nike-air-mag-back-to-the-future-417744-001_2-1300x1300.jpg",
        ],
        description: "Air Mags are the self lacing shoes that are worn by Marty McFly in Back To The Future 2",
        startingBid: 9000,
    },
    {
        name: "Belle's dress",
        image: [
          "https://www.dhresource.com/600x600/f2/albu/g5/M00/19/6F/rBVaI1jTjDyAHAOuAAW60_EjGQs999.jpg",
          "https://ae01.alicdn.com/kf/HTB1BNhYPVXXXXbpXVXXq6xXFXXXz/Belle-Traje-de-la-princesa-2017-de-La-Belleza-y-la-Bestia-Disfraces-Para-Adultos-Deluxe.jpg_640x640.jpg",
          "https://media1.popsugar-assets.com/files/thumbor/BomRpHvuLXnIpHgfi02VsyLOstU/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2016/11/09/653/n/1922564/132005a15e9268a7_Beauty-Beast-Pictures-2017_3_/i/Emma-Watson-Belle-Dress-Beauty-Beast-2016.jpg",
        ],
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
