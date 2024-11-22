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
      likes: 0,
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

    res.json({
      result: true,
      tweet: {
        _id: newTweet._id,
        createdAt: newTweet.createdAt,
        content: newTweet.content,
        user: { firstname: user.firstname, username: user.username },
      },
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/", (req, res) => {
  Tweet.find()
    .populate({ path: "user", select: "firstname username" })
    .sort({ createdAt: -1 })
    .then((tweets) => {
      res.json({ result: true, tweets });
    })
    .catch((err) => {
      console.error(err);
    });
});

router.post("/update-likes", (req, res) => {
  const { username, content, likes } = req.body;

  if (!username || !content || likes === undefined) {
    res.json({ result: false, error: "PROUT" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.json({
          result: false,
          error: "Pas d'utilisateur tulututu chapeau pointu",
        });
        return null;
      }

      return Tweet.findOne({ content, user: user._id });
    })
    .then((tweet) => {
      if (!tweet) {
        res.json({ result: false, error: "Y pas de tweet pov naz" });
        return null;
      }

      tweet.likes = (tweet.likes || 0) + Number(likes);
      return tweet.save();
    })
    .then((updatedTweet) => {
      if (updatedTweet) {
        res.json({ result: true, tweet: updatedTweet });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({ result: false, error: "TOUT KC MEC TOUCHE PLUS RIEN " });
    });
});
module.exports = router;
