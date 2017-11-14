const mongoose = require("mongoose")

// Schema setup
const propItemSchema = new mongoose.Schema({
  name: String,
  image: [String],
  description: String,
  startingBid: Number,
  currentBid: Number,
  highestBidder: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  expiryDate: Number,
  expired: Boolean,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  categories: {
    gender: String,
    category: String,
  }
})

module.exports = mongoose.model("PropItem", propItemSchema)
