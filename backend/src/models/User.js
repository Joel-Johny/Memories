const mongoose = require("mongoose");

// Define schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create model
const User = mongoose.model("User", userSchema);

module.exports = User;
