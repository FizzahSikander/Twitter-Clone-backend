import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    tags: [{ type: String }],
    comments: [
      {
        text: { type: String, required: true },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // automatically includes createdAt and updatedAt for tweets
);

const Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;
