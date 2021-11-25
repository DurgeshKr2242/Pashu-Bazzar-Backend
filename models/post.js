const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  image: { type: String },
  location: { type: String },
  price: { type: Number, required: true },
  contact: { type: Number, required: true },
  description: { type: String },
  breed: { type: String, required: true },
  creatorId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  // tags: [{ type: String }],
  // comments: { type: [String] },
});

module.exports = mongoose.model("Post", postSchema);
