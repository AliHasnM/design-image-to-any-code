import multer from "multer";

// Configure multer for storing design images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Temporary folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  },
});

// Middleware to handle image uploads
export const upload = multer({ storage });
