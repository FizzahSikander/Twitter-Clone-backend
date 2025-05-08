import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log("welcome to root");
  res.json({ message: "Welcome to root" }).status(200);
});

export default router;
