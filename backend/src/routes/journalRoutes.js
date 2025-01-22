const express = require("express");
const router = express.Router();
const {
  addOrUpdateJournal,
  getAllJournal,
} = require("../controllers/journalController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerCloudinaryMiddleware");

// Protected route to add or update a journal entry
router.post("/addOrUpdate", protect, upload, addOrUpdateJournal);
router.get("/getJournals", protect, getAllJournal);

module.exports = router;
