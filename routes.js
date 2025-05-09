import { Router } from "express";
import User from "./models/User.js";
import { handleRegister, handleLogin } from "./middlewares/handleUser.js";
const router = Router();

router.get("/", (req, res) => {
  console.log("welcome to root");
  res.json({ message: "Welcome to root" }).status(200);
});

router.post("/register", handleRegister);
router.post("/login", handleLogin);

export default router;
