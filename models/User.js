import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    about: { type: String, default: "" },
    occupation: { type: String, default: "" },
    hometown: { type: String, default: "" },
    website: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bio: String,
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dsr0s5lbq/image/upload/v1743707427/j8ry5tkeqmdhyoxp3nrc.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User
