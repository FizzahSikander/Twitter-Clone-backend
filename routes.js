import { Router } from "express";
import {
  handleRegister,
  handleLogin,
  validateUser,
  getUser,
  logoutUser,
  authResponse,
} from "./middlewares/handleUser.js";
import { followUser, unfollowUser } from "./middlewares/actions.js";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

import {
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


// Follow user routes
router.post('/users/:targetId/follow', validateUser, followUser);
router.post('/users/:targetId/unfollow', validateUser, unfollowUser);



export default router;
