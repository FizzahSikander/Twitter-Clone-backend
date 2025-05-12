import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true, unique: true },
    about: { type: String, default: "" },
    occupation: { type: String, default: "" },
    hometown: { type: String, default: "" },
    homepage: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
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




