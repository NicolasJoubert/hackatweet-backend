var express = require("express");
var router = express.Router();

const { checkBody } = require("../modules/checkBody");
const User = require("../models/users");
const Tweet = require("../models/tweets");
const Hashtag = require("../models/hashtags");

router.get("/", async (req, res) => {
  const hashtags = await Hashtag.find();
  if (hashtags.length == 0) {
    res.json({ result: false, error: "no hashtag in db" });
    return;
  }

  const hashtaglist = hashtags.map((hashtag) => {
    return {
      content: hashtag.content,
      tweetsNumber: hashtag.tweets.length,
    };
  });
  hashtaglist.sort((a, b) => b.tweetsNumber - a.tweetsNumber);

  res.json({ result: true, hashtags: hashtaglist });
});

module.exports = router;
