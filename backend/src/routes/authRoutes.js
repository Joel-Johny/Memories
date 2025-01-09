const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", protect, verifyUser);
module.exports = router;
