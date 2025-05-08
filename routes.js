import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log("welcome to root");
  res.json({ message: "Welcome to root" }).status(200);
});

router.post("/register", async (req, res) => {
  console.log("registering user...");
  res.json({ message: "Welcome to root" }).status(200);
});

export default router;
