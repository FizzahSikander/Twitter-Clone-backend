import Tweet from '../models/Tweet.js';
import User from '../models/User.js';

export const handleTweet = async (req, res) => {
  const { text, tags } = req.body;

  if (!text) return res.status(400).json({ error: 'Missing content!' });
  const newTweet = new Tweet({
    text: text.trim(),
    tags,
    createdBy: req.user.id,
  });

  await newTweet.save();

  await User.findByIdAndUpdate(req.user.id, { $push: { tweets: newTweet._id } });

  res.status(201).json({ message: 'Tweet created successfully' });
};

export const handleUserLastTweet = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const latestTweet = await Tweet.findOne({ createdBy: userId }).sort({ createdAt: -1 }).lean();

    if (!latestTweet) {
      return res.status(404).json({ message: 'No tweet found' });
    }

    latestTweet.commentCount = latestTweet.comments?.length || 0;
    res.status(200).json(latestTweet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.query;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleComment = async (req, res) => {
  const { tweetId, text } = req.body;


  if (!text || !tweetId) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  try {
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $push: {
          comments: {
            text,
            createdBy: req.user.id || null,
          },
        },
      },
      { new: true }
    );

    if (!updatedTweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    res.status(200).json({ message: 'Comment added', tweet: updatedTweet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByTweetId = async (req, res) => {
  const { tweetId } = req.query;

  try {
    const tweet = await Tweet.findById(tweetId).populate({
      path: 'comments.createdBy',
      select: 'text, createdAt, createdBy', // include only selected fields
    });

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    res.status(200).json(tweet.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
