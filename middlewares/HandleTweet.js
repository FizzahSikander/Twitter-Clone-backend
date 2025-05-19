import Tweet from "../models/Tweet.js";
import User from "../models/User.js";

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

export const HandleUserLastTweet = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const latestTweet = await Tweet.findOne({ createdBy: userId }).sort({
      createdAt: -1,
    });

    if (!latestTweet) {
      return res.status(404).json({ message: "No tweet found" });
    }

    res.json(latestTweet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ id: id });
  console.log(user);

  res.status(200).json({ user });
};
