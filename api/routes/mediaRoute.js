const express = require("express");
const router = express.Router();
const mediaController = require("../Controller/MediaController");

// Get all media files
router.get("/", mediaController.getAllMedia);

// Get media files by type (audio, pdf, image)
router.get("/type/:type", mediaController.getMediaByType);

// Search media files by name
router.get("/search", mediaController.searchMedia);

// Option 1: Get pre-signed URL for downloading
router.get("/download/:filename", mediaController.downloadMedia);

// Option 2: Stream file directly (alternative approach)
router.get("/stream/:filename", mediaController.streamMedia);

module.exports = router;
