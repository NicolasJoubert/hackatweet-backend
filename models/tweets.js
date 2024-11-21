const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  createdAt: Date,
  content: {
    type: String,
    maxlength: [250, "Le contenu ne peut pas dépasser 250 caractères"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
