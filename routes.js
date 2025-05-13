import { Router } from "express";
// import User from "./models/User.js";
// import Tweet from "./models/Tweet.js";
import {
  handleRegister,
  handleLogin,
  validateUser,
} from "./middlewares/handleUser.js";

const router = Router();

// Login & Registration
router.post("/register", handleRegister);
router.post("/login", handleLogin);

// Validation
router.get("/", (req, res) => {
  console.log("welcome to root");
  res.json({ message: "Welcome to root" }).status(200);
});

router.get("/validate", validateUser, (req, res) => {
  console.log(req.user);
  res.status(200).json({ message: "Token is valid", ok: true, user: req.user });
});

export default router;
