import router from "./routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
