const { cloudinary } = require("../middleware/multerCloudinaryMiddleware");
const Journal = require("../models/Journal");
const cleanupServerUploads = require("../utils/cleanupServerUploads");
const journalValidation = require("../utils/journalValidation");
const cleanupCloudinaryJournalData = require("../utils/deleteCloudinaryResource");

const addOrUpdateJournal = async (req, res) => {
  const {
    journalEntryDate,
    title,
    contentType,
    productivityRating,
    selectedMood,
  } = req.body;

  // console.log("Inside the controller", req.body);
  // console.log("Inside the controller", req.files);

  // Validate the journal entry
  // console.log("Running validation");
  const validationResult = journalValidation(req.body);

  if (validationResult.status === "fail") {
    return res.status(400).json({ message: validationResult.message });
  }

  // console.log("Validation success");
  try {
    // **Handle Thumbnail Upload**
    const existingJournal = await Journal.findOne({
      user: req.user.id,
      date: journalEntryDate,
    });
    if (existingJournal) await cleanupCloudinaryJournalData(existingJournal);

    let thumbnailUrl =
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    if (req.files.thumbnail) {
      const thumbnail = req.files.thumbnail[0];
      const thumbnailResult = await cloudinary.uploader.upload(thumbnail.path, {
        folder: "memories-journal/thumbnails",
      });
      thumbnailUrl = thumbnailResult.secure_url; // Cloudinary URL for thumbnail
    }

    // **Handle Snap Photo Uploads**
    const snapPhotoUrls = [];
    if (req.files.snapPhotos) {
      for (const snapPhoto of req.files.snapPhotos) {
        const snapResult = await cloudinary.uploader.upload(snapPhoto.path, {
          folder: "memories-journal/snapshots",
        });
        snapPhotoUrls.push(snapResult.secure_url); // Cloudinary URL for each snap photo
      }
    }

    // **Handle Content Upload (Text, Audio, or Video)**
    let contentPayload = null;
    if (contentType === "text") {
      // Directly save text content
      contentPayload = req.body.contentPayload;
    } else if (contentType === "audio/webm" || contentType === "video/webm") {
      // Upload audio/video to Cloudinary
      const contentFile = req.files.contentPayload[0];
      const contentResult = await cloudinary.uploader.upload(contentFile.path, {
        folder: "memories-journal/contents",
        resource_type: "auto", // Automatically determines if audio or video
      });
      contentPayload = contentResult.secure_url; // Cloudinary URL for content
    } else {
      return res.status(400).json({ message: "Invalid content type" });
    }

    // **Upsert Journal Entry**
    const journal = await Journal.findOneAndUpdate(
      { user: req.user.id, date: journalEntryDate },
      {
        $set: {
          title,
          content: { type: contentType, payload: contentPayload },
          thumbnail: thumbnailUrl,
          snapPhotos: snapPhotoUrls.length ? snapPhotoUrls : undefined,
          productivityRating,
          selectedMood: JSON.parse(selectedMood),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    const message =
      journal.createdAt === journal.updatedAt
        ? "Journal added successfully"
        : "Journal updated successfully";

    return res.status(200).json({ message, journal });
  } catch (error) {
    console.log("Something went wrong...", error.message);
    return res.status(500).json({ message: "Server error", error });
  } finally {
    // **Cleanup Uploaded Files**
    await cleanupServerUploads(req.files);
  }
};
const journalByDate = async (req, res) => {
  // console.log("Hey", req.params.date);
  try {
    const journal = await Journal.findOne({
      user: req.user.id,
      date: req.query.date,
    }).select("-user");
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const paginatedJournal = async (req, res) => {
  try {
    const userId = req.user.id;
    const skip = parseInt(req.query.skip) || 0; // Default skip = 0
    const limit = 3;

    const journals = await Journal.find({ user: userId })
      .sort({ date: -1 }) // Sort by date (newest first)
      .skip(skip)
      .limit(limit);

    const totalJournals = await Journal.countDocuments({ user: userId });
    const hasMore = skip + limit < totalJournals; // Check if more journals exist

    res.json({ journals, hasMore });
  } catch (error) {
    console.error("Error fetching paginated journals:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteJournal = async (req, res) => {
  try {
    const { journalEntryDate } = req.body;
    if (!journalEntryDate) {
      return res
        .status(400)
        .json({ message: "Journal entry date is required" });
    }
    const existingJournal = await Journal.findOne({
      user: req.user.id,
      date: journalEntryDate,
    });

    if (!existingJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    await cleanupCloudinaryJournalData(existingJournal);

    await existingJournal.deleteOne();
    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getJournalEntryDates = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from request

    // Fetch only the `date` field of journals, sorted in ascending order
    const journalDates = await Journal.find({ user: userId })
      .select("date -_id")
      .sort("date");

    // Extract dates into an array
    const dates = journalDates.map((journal) => journal.date);
    // console.log(dates);
    return res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching journal entry dates:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const metrics = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user's ID

    // 1. Total Journals
    const totalJournals = await Journal.countDocuments({ user: userId });

    // 2. Journals This Month

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // console.log("This is start of month", startOfMonth);
    // console.log("This is end of month", endOfMonth);
    const thisMonthJournals = await Journal.countDocuments({
      user: userId,
      $expr: {
        $and: [
          {
            $gte: [{ $dateFromString: { dateString: "$date" } }, startOfMonth],
          },
          { $lte: [{ $dateFromString: { dateString: "$date" } }, endOfMonth] },
        ],
      },
    });

    // 3. Happy Mood Days
    const happyMoodDays = await Journal.countDocuments({
      user: userId,
      "selectedMood.label": "Happy",
    });

    // Send response
    res.json({
      totalJournals,
      thisMonthJournals,
      happyMoodDays,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  addOrUpdateJournal,
  paginatedJournal,
  journalByDate,
  deleteJournal,
  getJournalEntryDates,
  metrics,
};
