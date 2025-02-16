const express = require("express");
const router = express.Router();
const {
  addOrUpdateJournal,
  paginatedJournal,
  journalByDate,
  deleteJournal,
  getJournalEntryDates,
  metrics,
} = require("../controllers/journalController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerCloudinaryMiddleware");

// Protected route to add or update a journal entry
router.post("/addOrUpdate", protect, upload, addOrUpdateJournal);
router.get("/date", protect, upload, journalByDate);
router.get("/paginated", protect, paginatedJournal); //need to rework on this route for pagination?
router.post("/deleteJournal", protect, deleteJournal);
router.get("/journal-entry-dates", protect, getJournalEntryDates);
router.get("/metrics", protect, metrics);

module.exports = router;
