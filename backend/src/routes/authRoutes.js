const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
  verifyUserEmail,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", protect, verifyUser);
router.get("/verify-email", verifyUserEmail);
module.exports = router;
