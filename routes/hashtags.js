var express = require("express");
var router = express.Router();

const { checkBody } = require("../modules/checkBody");
const User = require("../models/users");
const Tweet = require("../models/tweets");
const Hashtag = require("../models/hashtags");

router.post("/", async (req, res) => {
  // check if body is correct
  if (!checkBody(req.body, ["hashtagContent", "tweetContent", "username"])) {
    res.json({ result: false, error: "Bad request" });
    return;
  }

  try {
    const { hashtagContent, tweetContent, username } = req.body
    // check that hashtag exists
    const hashtag = await Hashtag.findOne( {content: hashtagContent})

    if (!hashtag) { // create hashtag in DB

        // get user who posted tweet with hashtag
        const user = await User.findOne({ username });
        if (!user) {
            res.json({ result: false, error: "User not found" });
            return;
        }

        // get tweet
        const tweet = await Tweet.findOne({ content: tweetContent, user: user._id });
        if (!tweet) {
            res.json({ result: false, error: "could not find tweet" });
            return;
        }
        console.log(tweet)
    }


  } catch(err) {
    console.error(err)
  }

})

module.exports = router;
