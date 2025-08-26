const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

// Memory storage so files don’t touch disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary helper
const uploadToCloudinary = (fileBuffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const uploadMiddleware = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(); // no files uploaded
    }

    const bodyUpdates = {};

    // Normalize req.files → always work with an array
    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();

    // Group by fieldname
    const grouped = {};
    filesArray.forEach((file) => {
      if (!grouped[file.fieldname]) grouped[file.fieldname] = [];
      grouped[file.fieldname].push(file);
    });

    // Upload grouped files
    for (const fieldName of Object.keys(grouped)) {
      const urls = await Promise.all(
        grouped[fieldName].map(async (file) => {
          if (!file.buffer) throw new Error("File buffer missing");
          const result = await uploadToCloudinary(file.buffer, "uploads");
          return result.secure_url;
        })
      );

      bodyUpdates[fieldName] = urls.length === 1 ? urls[0] : urls;
    }

    req.body = { ...req.body, ...bodyUpdates };
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Failed to upload files", details: error.message });
  }
};

module.exports = { upload, uploadMiddleware };
