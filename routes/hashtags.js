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
    
    // get user who posted tweet with hashtag
    const user = await User.findOne({ username });
    if (!user) {
        res.json({ result: false, error: "User not found" });
        return;
    }
    
    // get tweet
    const tweet = await Tweet.findOne({ content: tweetContent, user: user._id });
    console.log(tweet)
    if (!tweet) {
        res.json({ result: false, error: "could not find tweet" });
        return;
    }
    
    // manage hashtag creation or update
    const hashtag = await Hashtag.findOne( {content: hashtagContent})
    if (!hashtag) {
        // create new hashtag
        const newHashtag = new Hashtag({
            content: hashtagContent,
            tweets: [tweet._id]
        })
        const savedHashtag = await newHashtag.save()
        if (!savedHashtag) {
            res.json({ result: false, error: "could not save hashtag" });
            return;
        }
        res.json({result: true})
    } else {
        // update hashtag with new tweet
        const updatedHashtag = await Hashtag.updateOne(
            { content: hashtagContent },
            { $push: { tweets: tweet._id } }
        )
        if (updatedHashtag.modifiedCount === 0) {
            res.json({ result: false, error: "could not update" });
            return;
        }

        res.json({ result: true })
    }
    



  } catch(err) {
    console.error(err)
  }

})

module.exports = router;
