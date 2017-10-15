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
        currentBid: 9000,
        highestBidder: '',
        expiryDate: 1508086800,
        expired: false,
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
        currentBid: 2500,
        highestBidder: '',
        expiryDate: 1518110193,
        expired: false,
    },
    {
      name: "Daenerys Targaryen Dress",
      image: [
        "http://i.ebayimg.com/images/g/onoAAOSw8GhZgaZ4/s-l500.jpg",
        "http://i.ebayimg.com/images/g/NQ0AAOSw8apZgaZ3/s-l500.jpg",
        "https://lovelace-media.imgix.net/uploads/695/f3fea1a0-cb3a-0132-9a8b-0e01949ad350.jpg?w=740&h=1115&fit=crop&crop=faces&auto=format&q=70"
      ],
      description: "The dress worn by Daenerys Targaryen (Emilia Clarke) in Season 1 of the critically acclaimed TV series, Game Of Thones",
      startingBid: 6000,
      currentBid: 6000,
      highestBidder: '',
      expiryDate: 1518110193,
      expired: false,
    },
    {
      name: "Don Vito Corleone Revenge Suit",
      image: [
        "https://www.thegoldencloset.com/merchant/graphics/00000001/D0003.jpg",
        "https://www.thegoldencloset.com/merchant/graphics/00000001/D0003e.jpg",
        "https://www.thegoldencloset.com/merchant/graphics/00000001/D0003h.jpg"
      ],
      description: "The suit won by Don Vito Corelone, portrayed by the legendary Robert De Niro, in the iconic revenge scene of Godfather II. Mr. DeNiro wore the suit in a pivotal scene from the film in which a young Vito Corleone returns to his native Italy on a mission to avenge the murder of his father.",
      startingBid: 15000,
      currentBid: 15000,
      highestBidder: '',
      expiryDate: 1508086800,
      expired: false,
    },
    {
      name: "Danny Zuko's T Birds Jacket",
      image: [
        "https://www.fjackets.com/product_images/f/630/John_Travolta_Grease_T-Birds_Black_Jacket__84313_zoom.jpg",
        "https://www.fjackets.com/product_images/b/749/T-Bird_Jacket__99755_zoom.jpg",
        "http://wardrobeadvice.com/wp-content/uploads/2009/03/Grease-John-Travolta.jpg"
      ],
      description: "Danny's (John Travolta) iconic T-birds leather jacket. If you want to groove your dancing move including impressing the ladies with your nice gelled hair, then this T-Birds Jacket is what you must to work this out completely.",
      startingBid: 3500,
      currentBid: 3500,
      highestBidder: '',
      expiryDate: ((Date.now()/1000) + 60),
      expired: false,
    }
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
