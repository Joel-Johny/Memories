const express = require("express");
const router = express.Router();
const {
  addOrUpdateJournal,
  getAllJournal,
  journalByDate,
  deleteJournal,
  getJournalEntryDates,
} = require("../controllers/journalController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerCloudinaryMiddleware");

// Protected route to add or update a journal entry
router.post("/addOrUpdate", protect, upload, addOrUpdateJournal);
router.get("/date", protect, upload, journalByDate);
router.get("/all", protect, getAllJournal); //need to rework on this route for pagination?
router.post("/deleteJournal", protect, deleteJournal);
router.get("/journal-entry-dates", protect, getJournalEntryDates);

module.exports = router;
