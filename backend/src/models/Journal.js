const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String, // Consider using Date type for better date handling
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: {
      type: String, // 'text', 'video', or 'audio'
      enum: ["text", "video", "audio"],
      required: true,
    },
    payload: {
      type: String, // URL for video/audio or text content
      required: true,
    },
  },
  thumbnail: {
    type: String, // Cloudinary URL
    default:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Set a default thumbnail URL
  },
  snapPhotos: [
    {
      type: String, // Array of Cloudinary URLs
    },
  ],
  productivityRating: {
    type: Number,
    default: 5,
    min: 1, // Add validation for the range if needed
    max: 10,
  },
  selectedMood: {
    emoji: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("Journal", journalSchema);
