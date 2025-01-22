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
    console.log(journalEntryDate, currentDate);
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

  console.log("Inside the controller", req.body);
  console.log("Inside the controller", req.files);

  // Validate the journal entry
  const validationResult = journalEntryValidation(req.body);
  console.log("running validation", validationResult);

  if (validationResult.status === "fail") {
    return res.status(400).json({ message: validationResult.message });
  }
  try {
    // **Handle File Uploads**
    let thumbnailUrl = "";
    if (req.files.thumbnail) {
      const thumbnailResult = await cloudinary.uploader.upload(
        req.files.thumbnail[0].path,
        { folder: "journals/thumbnails" }
      );
      thumbnailUrl = thumbnailResult.secure_url;
    }

    const snapPhotoUrls = [];
    if (req.files.snapPhotos) {
      for (const snapPhoto of req.files.snapPhotos) {
        const snapResult = await cloudinary.uploader.upload(snapPhoto.path, {
          folder: "journals/snapshots",
        });
        console.log("This is individaula snap photo data", snapPhoto.path);
        snapPhotoUrls.push(snapResult.secure_url);
      }
    }
    // **Handle Content Type**
    let contentPayload = null;
    if (content.type === "text") {
      // Directly save text content
      contentPayload = content.payload;
    } else if (content.type === "audio" || content.type === "video") {
      // Upload file to Cloudinary
      const fileKey = content.type === "audio" ? "audio" : "video";
      if (!req.files[fileKey]) {
        return res
          .status(400)
          .json({ message: `${content.type} file is required` });
      }
      const uploadResult = await cloudinary.uploader.upload(
        req.files[fileKey][0].path,
        { folder: `journals/${content.type}s` }
      );
      contentPayload = uploadResult.secure_url;
    } else {
      return res.status(400).json({ message: "Invalid content type" });
    }

    // **Upsert Journal Entry**
    const journal = await Journal.findOneAndUpdate(
      { user: req.user.id, date: journalEntryDate },
      {
        $set: {
          title,
          content: { type: content.type, payload: contentPayload },
          thumbnail: thumbnailUrl,
          snapPhotos: snapPhotoUrls.length ? snapPhotoUrls : undefined,
          productivityRating,
          selectedMood,
        },
      },
      { new: true, upsert: true }
    );

    const message =
      journal.createdAt === journal.updatedAt
        ? "Journal added successfully"
        : "Journal updated successfully";

    return res.status(200).json({ message, journal });
  } catch (error) {
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
