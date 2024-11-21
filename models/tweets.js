const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  createdAt: Date,
  content: {
    type: String,
    maxlength: [280, "Le contenu ne peut pas dépasser 280 caractères"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
