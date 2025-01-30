const express = require("express");
const router = express.Router();
const {
  addOrUpdateJournal,
  getAllJournal,
  journalByDate,
  deleteJournal,
} = require("../controllers/journalController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerCloudinaryMiddleware");

// Protected route to add or update a journal entry
router.post("/addOrUpdate", protect, upload, addOrUpdateJournal);
router.get("/:date", protect, upload, journalByDate);
router.get("/getJournals", protect, getAllJournal);
router.post("/deleteJournal", protect, deleteJournal);

module.exports = router;
