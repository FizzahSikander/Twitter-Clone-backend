import { Router } from "express";
// import User from "./models/User.js";
// import Tweet from "./models/Tweet.js";
import {
  handleRegister,
  handleLogin,
  validateUser, getUser
} from "./middlewares/handleUser.js";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });


import { HandleTweet } from "./middlewares/handleTweet.js";

const router = Router();

// Login & Registration
router.post("/register", upload.single("image"), handleRegister);
router.post("/login", handleLogin);



router.get("/profile/:username", getUser);

// Validation
router.get("/validate", validateUser, (req, res) => {
  console.log(req.user);
  res.status(200).json({ message: "Token is valid", ok: true, user: req.user });
});

// saving tweet
router.post("/tweet", HandleTweet);

export default router;
