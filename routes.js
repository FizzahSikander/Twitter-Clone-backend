import { Router } from "express";
// import User from "./models/User.js";
// import Tweet from "./models/Tweet.js";
import {
  handleRegister,
  handleLogin,
  validateUser,
  getUser,
  logoutUser,
} from "./middlewares/handleUser.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

import {
  HandleTweet,
  HandleUserLastTweet,
  getUserById,
  handleComment,
  getCommentsByTweetId,
} from "./middlewares/handleTweet.js";

const router = Router();

// Login & Registration
router.post("/register", upload.single("image"), handleRegister);
router.post("/login", handleLogin);
router.get("/logout", logoutUser);

router.get("/profile/:username", getUser);

// Validation
router.get("/validate", validateUser, (req, res) => {
  // console.log(req.user);
  res.status(200).json({ message: "Token is valid", ok: true, user: req.user });
});

// saving tweet
router.post("/tweet", HandleTweet);
// get the latest tweet by user id
router.get("/user-latest-tweet", HandleUserLastTweet);

// add comment
router.put("/comment", handleComment);

// get comments by tweetID
router.get("/comments", getCommentsByTweetId);

// get the user by user id
router.get("/user", getUserById);

export default router;
