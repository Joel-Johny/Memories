const { get } = require("mongoose");
const Journal = require("../models/Journal");

// Add or update journal entry
const addOrUpdateJournal = async (req, res) => {
  const { content, title } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  // Get the current date in 'YYYY-MM-DD' format
  const currentDate = new Date().toISOString().split("T")[0];

  try {
    // Check if a journal entry already exists for the user and current date
    const existingJournal = await Journal.findOne({
      user: req.user.id,
      date: currentDate,
    });

    if (existingJournal) {
      // Update existing journal entry
      existingJournal.content = content;
      existingJournal.title = title;
      await existingJournal.save();
      return res.status(200).json({
        message: "Journal updated successfully",
        journal: existingJournal,
      });
    } else {
      // Create a new journal entry
      const journal = new Journal({
        user: req.user._id,
        date: currentDate,
        title,
        content,
      });
      //   console.log(journal);
      await journal.save();
      return res
        .status(201)
        .json({ message: "Journal added successfully", journal });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const getAllJournal = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id });
    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { addOrUpdateJournal, getAllJournal };
