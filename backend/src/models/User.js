const mongoose = require("mongoose");
// Define schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  verified: {
    type: Boolean,
    default: false,
  },
});

// Create model
const User = mongoose.model("User", UserSchema);

module.exports = User;
