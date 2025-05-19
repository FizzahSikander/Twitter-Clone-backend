import { Router } from "express";
// import User from "./models/User.js";
// import Tweet from "./models/Tweet.js";
import {
  handleRegister,
  handleLogin,
  validateUser,
  getUser,
  logoutUser,
  AuthResponse,
} from "./middlewares/handleUser.js";
import { followUser, unfollowUser } from "./middlewares/actions.js";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

import {
  HandleTweet,
  HandleUserLastTweet,
} from "./middlewares/handleTweet.js";

const router = Router();

// Login & Registration
router.post("/register", upload.single("image"), handleRegister);
router.post("/login", handleLogin);
router.get("/logout", logoutUser);

router.get("/profile/:username", getUser);

// Validation
router.get("/validate", validateUser, AuthResponse);

// saving tweet
router.post("/tweet", validateUser, HandleTweet);

// get the latest tweet by user id
router.get("/user-latest-tweet", HandleUserLastTweet);


// Follow user routes
router.post('/users/:targetId/follow', validateUser, followUser);
router.post('/users/:targetId/unfollow', validateUser, unfollowUser);



export default router;
