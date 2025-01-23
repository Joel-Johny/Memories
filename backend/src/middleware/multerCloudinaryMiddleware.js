const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "memories-journal",
    allowed_formats: ["jpg", "png", "jpeg", "webm", "mp4", "mov"], // Add more formats as needed
    resource_type: "auto", // Explicitly set for video uploads
  },
  error: (err, cb) => {
    console.error("Cloudinary Storage Error:", err);
    cb(err);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log("File for Cloudinary:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
    });
    cb(null, true);
  },
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "snapPhotos", maxCount: 5 },
  { name: "contentPayload", maxCount: 1 }, // Allow only one contentPayload file
]);

module.exports = { upload };
