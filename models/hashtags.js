const mongoose = require("mongoose");

const hastagSchema = mongoose.Schema({
  content: String,
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweets" }],
});

const Hastag = mongoose.model("hashtags", hastagSchema);

module.exports = Hastag;
