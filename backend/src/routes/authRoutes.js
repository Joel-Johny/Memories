const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
  terminateAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", protect, verifyUser);
router.delete("/terminateAccount", protect, terminateAccount);

module.exports = router;
