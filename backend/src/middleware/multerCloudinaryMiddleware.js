const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure the uploads directory exists
const uploadDir =
  process.env.VERCEL === "1" ? "/tmp" : path.join(__dirname, "../../uploads");
// console.log(uploadDir, "vercel env", process.env.VERCEL);
if (process.env.VERCEL === "0" && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Make sure this uploads folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Multer Upload Middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "video/webm",
      "audio/webm",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "snapPhotos", maxCount: 5 },
  { name: "contentPayload", maxCount: 1 },
]);

module.exports = { upload, cloudinary };
