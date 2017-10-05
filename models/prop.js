const mongoose = require("mongoose")

// Schema setup
const propItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  startingBid: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
})

module.exports = mongoose.model("PropItem", propItemSchema)
