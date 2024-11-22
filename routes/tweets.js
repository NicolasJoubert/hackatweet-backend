var express = require("express");
var router = express.Router();

const { checkBody } = require("../modules/checkBody");
const User = require("../models/users");
const Tweet = require("../models/tweets");

router.post("/", async (req, res) => {
  // check if body is correct
  if (!checkBody(req.body, ["token", "content"])) {
    res.json({ result: false, error: "Bad request" });
    return;
  }

  // retrieve body elements
  const { token, content } = req.body;

  if (content.length > 280) {
    res.json({ result: false, error: "content too long" });
    return;
  }

  try {
    // get user in database to retrieve user._id
    const user = await User.findOne({ token });
    if (!user) {
      res.status.json({ result: false, error: "Could not retrieve user" });
      return;
    }

    // create tweet
    const newTweet = new Tweet({
      createdAt: Date.now(),
      content,
      user: user._id,
    });

    if (!newTweet) {
      res.status.json({ result: false, error: "Could not create tweet" });
      return;
    }

    const savedTweet = await newTweet.save();
    if (!savedTweet) {
      res.status.json({ result: false, error: "Could not save tweet" });
      return;
    }

    res.json({ result: true, tweet: savedTweet });
  } catch (err) {
    console.error(err);
  }
});

router.get("/", (req, res) => {
  Tweet.find()
    .populate({ path: "user", select: "firstname username" })
    .then((tweets) => {
      res.json({ result: true, tweets });
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
