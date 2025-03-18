const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3");

// Helper function to determine file type based on file extension
const getFileType = (key) => {
  const extension = key.split(".").pop().toLowerCase();

  if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
    return "audio";
  } else if (["pdf"].includes(extension)) {
    return "pdf";
  } else if (
    ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension)
  ) {
    return "image";
  } else {
    return "other";
  }
};

// Get all media files from S3 bucket
exports.getAllMedia = async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const { Contents } = await s3.send(command);

    if (!Contents || Contents.length === 0) {
      return res.status(200).json({ media: [] });
    }

    // Transform the response to match frontend expectations
    const mediaFiles = Contents.map((item, index) => {
      const fileType = getFileType(item.Key);

      return {
        id: index + 1,
        name: item.Key,
        type: fileType,
        url: `/api/media/download/${encodeURIComponent(item.Key)}`, // URL to download endpoint
        size: item.Size,
        lastModified: item.LastModified,
      };
    });

    res.status(200).json({ media: mediaFiles });
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    res.status(500).json({ error: "Failed to retrieve media files" });
  }
};

// Filter media by type (audio, pdf, image)
exports.getMediaByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!["audio", "pdf", "image", "all"].includes(type)) {
      return res.status(400).json({ error: "Invalid media type" });
    }

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const { Contents } = await s3.send(command);

    if (!Contents || Contents.length === 0) {
      return res.status(200).json({ media: [] });
    }

    // Filter and transform the response
    let mediaFiles = Contents.map((item, index) => {
      const fileType = getFileType(item.Key);

      return {
        id: index + 1,
        name: item.Key,
        type: fileType,
        url: `/api/media/download/${encodeURIComponent(item.Key)}`,
        size: item.Size,
        lastModified: item.LastModified,
      };
    });

    // Filter by type if not 'all'
    if (type !== "all") {
      mediaFiles = mediaFiles.filter((file) => file.type === type);
    }

    res.status(200).json({ media: mediaFiles });
  } catch (error) {
    console.error("Error listing S3 objects by type:", error);
    res.status(500).json({ error: "Failed to retrieve media files" });
  }
};

// Generate a pre-signed URL to download a specific file
exports.downloadMedia = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // Create command to get the object
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
    });

    // Generate pre-signed URL (valid for 15 minutes)
    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 15 * 60, // 15 minutes in seconds
    });

    // Option 1: Redirect to the signed URL
    // return res.redirect(signedUrl);

    // Option 2: Return the signed URL
    return res.status(200).json({ downloadUrl: signedUrl });
  } catch (error) {
    console.error("Error generating download URL:", error);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
};

// Stream file directly to client (improved version for audio/media playback)
exports.streamMedia = async (req, res) => {
  try {
    const { filename } = req.params;

    console.log(`Streaming file: ${filename}`);

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // Get file extension for better MIME type detection
    const extension = filename.split(".").pop().toLowerCase();
    let contentTypeOverride = null;

    // Handle specific audio formats with precise MIME types
    if (extension === "mp3") {
      contentTypeOverride = "audio/mpeg";
    } else if (extension === "wav") {
      contentTypeOverride = "audio/wav";
    } else if (extension === "ogg") {
      contentTypeOverride = "audio/ogg";
    } else if (extension === "m4a") {
      contentTypeOverride = "audio/mp4";
    }

    // Create command to get the object
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
    });

    // Get the object
    const { Body, ContentType, ContentLength } = await s3.send(command);

    console.log(`File details: Type=${ContentType}, Size=${ContentLength}`);

    // For playback in browser (not download), we don't want to force download
    const isDownload = req.query.download === "true";

    // Set appropriate headers
    if (isDownload) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
    } else {
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    }

    // Use our override MIME type if available, otherwise fall back to S3's ContentType
    if (contentTypeOverride) {
      res.setHeader("Content-Type", contentTypeOverride);
    } else if (ContentType) {
      res.setHeader("Content-Type", ContentType);
    }

    if (ContentLength) {
      res.setHeader("Content-Length", ContentLength);
    }

    // Add CORS headers for browser playback
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Stream the file to the response
    Body.pipe(res);
  } catch (error) {
    console.error("Error streaming file:", error);
    if (error.name === "NoSuchKey") {
      return res.status(404).json({ error: "File not found" });
    }
    res.status(500).json({ error: "Failed to stream file" });
  }
};

// Search media files by name
exports.searchMedia = async (req, res) => {
  try {
    const { query } = req.query;
    const { type } = req.query; // Optional type filter

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const { Contents } = await s3.send(command);

    if (!Contents || Contents.length === 0) {
      return res.status(200).json({ media: [] });
    }

    // Filter and transform the response
    let mediaFiles = Contents.map((item, index) => {
      const fileType = getFileType(item.Key);

      return {
        id: index + 1,
        name: item.Key,
        type: fileType,
        url: `/api/media/download/${encodeURIComponent(item.Key)}`,
        size: item.Size,
        lastModified: item.LastModified,
      };
    });

    // Filter by search query (case insensitive)
    mediaFiles = mediaFiles.filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase())
    );

    // Additional filter by type if provided
    if (type && type !== "all") {
      mediaFiles = mediaFiles.filter((file) => file.type === type);
    }

    res.status(200).json({ media: mediaFiles });
  } catch (error) {
    console.error("Error searching S3 objects:", error);
    res.status(500).json({ error: "Failed to search media files" });
  }
};
