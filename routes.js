import { Router } from "express";
import {
  handleRegister,
  handleLogin,
  validateUser,
  getUser,
  logoutUser,
  authResponse,
  editUserImg
} from "./middlewares/handleUser.js";
import { followUser, getTrendingTags, searchHandler, unfollowUser } from "./middlewares/actions.js";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

import {
  getUserById,
  handleComment,
  getCommentsByTweetId,
  handleTweet,
  handleUserLastTweet,
} from "./middlewares/handleTweet.js";

const router = Router();

// Login & Registration
router.post("/register", upload.single("image"), handleRegister);
router.post("/login", handleLogin);
router.get("/logout", logoutUser);

router.get("/profile/:username", getUser);

// Validation
router.get("/validate", validateUser, authResponse);

// saving tweet
router.post("/tweet", validateUser, handleTweet);

// get the latest tweet by user id
router.get("/user-latest-tweet", handleUserLastTweet);

// add comment
router.put("/comment", validateUser, handleComment);

// get comments by tweetID
router.get("/comments", getCommentsByTweetId);

// get the user by user id
router.get("/user", getUserById);

// Follow user routes
router.post("/users/:targetId/follow", validateUser, followUser);
router.post("/users/:targetId/unfollow", validateUser, unfollowUser);



router.get('/search', searchHandler);

router.patch('/edit-profile', validateUser, upload.any(), editUserImg);


router.get('/tags', getTrendingTags);


export default router;
