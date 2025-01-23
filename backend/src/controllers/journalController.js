const { cloudinary } = require("../middleware/multerCloudinaryMiddleware");
const Journal = require("../models/Journal");

const journalEntryValidation = ({
  journalEntryDate,
  title,
  contentType,
  productivityRating,
  selectedMood,
}) => {
  // **Data Validation**
  if (!journalEntryDate) {
    return { status: "fail", message: "Journal entry date is required" };
  }

  if (!title) {
    return { status: "fail", message: "Title is required" };
  }

  if (!contentType) {
    return { status: "fail", message: "Content and its type are required" };
  }

  // Validate journalEntryDate
  const currentDate = new Date().toISOString().split("T")[0];
  if (new Date(journalEntryDate) < currentDate) {
    // console.log(journalEntryDate, currentDate);
    return {
      status: "fail",
      message: "Cannot add or update journals for past dates",
    };
  }

  if (!productivityRating) {
    return { status: "fail", message: "Productivity rating is required" };
  }

  const mood = JSON.parse(selectedMood);
  if (mood.emoji === "" || mood.label === "") {
    return { status: "fail", message: "Mood is required" };
  }

  // If all validations pass
  return { status: "success", message: "Validation passed" };
};

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
  console.log("running validation");
  const validationResult = journalEntryValidation(req.body);

  if (validationResult.status === "fail") {
    return res.status(400).json({ message: validationResult.message });
  }
  console.log("validation success");
  try {
    // **Handle File Uploads**
    let thumbnailUrl =
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    if (req.files.thumbnail) thumbnailUrl = req.files.thumbnail[0].path;

    const snapPhotoUrls = [];
    if (req.files.snapPhotos) {
      for (const snapPhoto of req.files.snapPhotos)
        snapPhotoUrls.push(snapPhoto.path);
    }
    // **Handle Content Type**
    let contentPayload = null;
    if (contentType === "text") {
      // Directly save text content
      contentPayload = req.body.contentPayload;
    } else if (contentType === "audio/webm" || contentType === "video/webm") {
      // Upload file to Cloudinary
      contentPayload = req.files.contentPayload[0].path;
      // console.log(req.files.contentPayload);
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
    // console.log(journal);

    const message =
      journal.createdAt === journal.updatedAt
        ? "Journal added successfully"
        : "Journal updated successfully";

    return res.status(200).json({ message, journal });
  } catch (error) {
    console.log("Somwthing went wrong dude.....", error.message);
    return res.status(500).json({ message: "Server error", error });
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
