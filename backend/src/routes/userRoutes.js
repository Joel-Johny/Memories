// routes/userRoutes.js
const express = require("express");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");
const router = express.Router();

router.get("/getAll", getAllUsers);
router.post("/create", createUser);
router.get("/getUser/:id", getUserById);
router.put("/updateUser/:id", updateUserById);
router.delete("/deleteUser/:id", deleteUserById);

module.exports = router;
