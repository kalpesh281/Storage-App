const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const path = require("path");

exports.uploadFileToS3 = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "File upload failed or invalid file type." });
    }

    const file = req.file;
    // Use the original filename for S3 key
    const fileName = file.originalname;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    res.status(200).json({
      message: "File uploaded successfully",
      fileType: file.mimetype,
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
