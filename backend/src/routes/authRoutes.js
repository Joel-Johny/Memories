const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser);
module.exports = router;
