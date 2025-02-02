const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming your User model is here
import { v4 as uuidv4 } from "uuid";
import EmailVerificationMagicLink from "../models/EmailVerificationMagicLink.js";
import { sendVerificationEmail } from "../utils/mailer.js";
// Controller function to register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Store the hashed password
    });
    // Generate verification token
    const token = uuidv4();

    // Save magic link
    await EmailVerificationMagicLink.create({
      token,
      userId: newUser._id,
    });

    await sendVerificationEmail(newUser.email, token);

    // Save the user
    await newUser.save();

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
      });
    }
    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    // console.log("Verification done by the auth middleware protect");
    const userDetails = {
      name: req.user.name,
      email: req.user.email,
    };
    // console.log(req.user);
    res.status(200).json(userDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyUserEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Find and validate token
    const magicLink = await EmailVerificationMagicLink.findOneAndDelete({
      token,
    });
    if (!magicLink)
      return res.status(400).json({ error: "Invalid or expired token" });

    // Update user verification status
    await User.findByIdAndUpdate(magicLink.userId, { verified: true });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Email verification failed" });
  }
};

module.exports = { registerUser, loginUser, verifyUser, verifyUserEmail };
