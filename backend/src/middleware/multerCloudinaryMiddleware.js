const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "memories-journal", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mp3"],
    resource_type: "auto", // Auto-detect the file type (image, video, audio)
  },
});

const upload = multer({ storage }).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "snapPhotos", maxCount: 5 },
  { name: "contentPayload", maxCount: 1 },
]);

module.exports = { upload, cloudinary };
