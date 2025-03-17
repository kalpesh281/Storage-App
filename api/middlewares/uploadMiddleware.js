const multer = require("multer");
const path = require("path");

// Define allowed file types by both extension and MIME type
const fileFilter = (req, file, cb) => {
  console.log("File being processed:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
  });

  // Get file extension
  const ext = path.extname(file.originalname).toLowerCase();

  // List of allowed extensions
  const allowedExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".wav",
    ".mp3",
    ".flac",
    ".pdf",
    ".docx",
  ];

  // List of allowed MIME types (more comprehensive)
  const allowedMimeTypes = [
    // Images
    "image/png",
    "image/jpeg",
    "image/jpg",

    // Audio
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/flac",
    "audio/x-flac",

    // Documents
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ];

  // Check if either extension or MIME type is allowed
  if (
    allowedExtensions.includes(ext) ||
    allowedMimeTypes.includes(file.mimetype)
  ) {
    return cb(null, true);
  }

  // If we're here, file type is not allowed
  cb(
    new Error(
      "Invalid file type. Allowed: PNG, JPG, WAV, FLAC, MP3, PDF, DOCX"
    ),
    false
  );
};

// Multer storage config
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

module.exports = upload;
