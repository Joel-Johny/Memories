const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming your User model is here
const uuidv4 = require("uuid").v4;
const EmailVerificationMagicLink = require("../models/EmailVerificationMagicLink");
const { sendVerificationEmail } = require("../utils/mailer.js");
// Controller function to register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    // If user exists...
    if (user) {
      // If the user is verified, no need to register again.
      if (user.verified) {
        return res.status(400).json({
          message: "User already exists and is verified. Please login.",
        });
      } else {
        // User exists but is not verified.
        // Look for an existing magic link.
        let magicLink = await EmailVerificationMagicLink.findOne({
          userId: user._id,
        });
        if (!magicLink) {
          // If no magic link exists, generate a new token.
          const token = uuidv4();
          magicLink = await EmailVerificationMagicLink.create({
            token,
            userId: user._id,
          });
          await sendVerificationEmail(user.email, token);
        } else {
          // If a magic link already exists, you may choose to re-send it.
          await sendVerificationEmail(user.email, magicLink.token);
        }
        return res.status(200).json({
          message:
            "Verification email sent. Please check your email to verify your account.",
        });
      }
    }

    // If user does not exist, create a new user.
    // Hash the password before saving.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with verified flag set to false.
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
    });

    // Save the new user first so we have a valid _id for the magic link.
    await newUser.save();

    // Generate a verification token.
    const token = uuidv4();

    // Save the magic link for email verification.
    await EmailVerificationMagicLink.create({
      token,
      userId: newUser._id,
    });

    // Send the verification email with the magic link.
    await sendVerificationEmail(newUser.email, token);

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

    if (!user?.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in!",
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
      return res.status(400).json({ message: "Invalid or expired token!" });

    // Update user verification status
    await User.findByIdAndUpdate(magicLink.userId, { verified: true });

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed!" });
  }
};

module.exports = { registerUser, loginUser, verifyUser, verifyUserEmail };
