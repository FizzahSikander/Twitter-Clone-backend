import Tweet from "../models/Tweet.js";

const jwtSecret = "secret by hamoudi";

export const HandleTweet = async (req, res) => {
  const { text, tags, comments, createdBy } = req.body;

  const newTweet = new Tweet({
    text,
    tags,
    createdBy,
  });

  await newTweet.save();
  res.status(201).json({ message: "Tweet created successfully" });
};
