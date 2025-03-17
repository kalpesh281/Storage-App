const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware"); // Import multer middleware
const { uploadFileToS3 } = require("../Controller/uploadController"); // Import controller

// Route for file upload
router.post("/upload", upload.single("file"), uploadFileToS3);

module.exports = router;
