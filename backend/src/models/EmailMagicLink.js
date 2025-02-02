import mongoose from "mongoose";

const magicLinkSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // 1 hour in seconds
  },
});

export default mongoose.model("MagicLink", magicLinkSchema);
