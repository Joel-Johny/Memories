const { cloudinary } = require("../middleware/multerCloudinaryMiddleware");
const Journal = require("../models/Journal");
const fs = require("fs/promises"); // For file system operations with promises

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

const cleanupUploads = async (files) => {
  try {
    // Loop through each field in `files`
    for (const field in files) {
      for (const file of files[field]) {
        console.log(`Deleting file: ${file.path}`);
        await fs.unlink(file.path); // Delete the file
      }
    }
    console.log("All files uploaded in server cleaned up successfully");
  } catch (err) {
    console.error("Error while cleaning up uploads", err.message);
  }
};

const cleanupCloudinaryData = async (userId) => {
  // **Check for Existing Journal**
  console.log("cloudinary cleanup");
  const currentDate = new Date().toISOString().split("T")[0];

  const existingJournal = await Journal.findOne({
    user: userId,
    date: currentDate,
  });

  if (existingJournal) {
    console.log(
      "Existing journal found. Deleting associated resources from cloudinary."
    );
    const deleteCloudinaryResource = async (publicId) => {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted Result for url:`, publicId, result);
      } catch (error) {
        console.error(`Error deleting resource:`, error);
      }
    };
    // **Delete Existing Resources from Cloudinary**
    const defaultThumbnail =
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    if (
      existingJournal.thumbnail &&
      existingJournal.thumbnail !== defaultThumbnail
    ) {
      const publicId =
        "memories-journal/thumbnails/" +
        existingJournal.thumbnail.split("/").pop().split(".")[0];
      deleteCloudinaryResource(publicId);
    }

    if (existingJournal.snapPhotos && existingJournal.snapPhotos.length) {
      for (const snapPhoto of existingJournal.snapPhotos) {
        const publicId =
          "memories-journal/snapshots/" +
          snapPhoto.split("/").pop().split(".")[0];
        deleteCloudinaryResource(publicId);
      }
    }

    if (
      existingJournal.content.type !== "text" &&
      existingJournal.content.payload
    ) {
      const publicId =
        "memories-journal/contents/" +
        existingJournal.content.payload.split("/").pop().split(".")[0];
      deleteCloudinaryResource(publicId);
    }

    console.log("All associated resources deleted.");
  }
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
  // console.log("Running validation");
  const validationResult = journalEntryValidation(req.body);

  if (validationResult.status === "fail") {
    return res.status(400).json({ message: validationResult.message });
  }

  // console.log("Validation success");
  try {
    // **Handle Thumbnail Upload**
    await cleanupCloudinaryData(req.user.id);
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
    await cleanupUploads(req.files);
  }
};
const journalByDate = async (req, res) => {
  // console.log("Hey", req.params.date);
  try {
    const journal = await Journal.findOne({
      user: req.user.id,
      date: req.params.date,
    });
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
module.exports = { addOrUpdateJournal, getAllJournal, journalByDate };
