const path = require("path");
const { uploadFile } = require("../helpers/fileUploader");

const uploadMiddleware = async (req, res, next) => {
    console.log(req.file)
  try {
    let uploadedKeys = [];

    if (req.file) {
      const key = `uploads/${Date.now()}-${req.file.originalname}`;
      const success = await uploadFile(req.file, key);
      if (!success) throw new Error("File upload failed");
      uploadedKeys = [key];
    } else if (req.files && req.files.length > 0) {
      uploadedKeys = await Promise.all(
        req.files.map(async (file) => {
          const key = `uploads/${Date.now()}-${file.originalname}`;
          const success = await uploadFile(file, key);
          if (!success) throw new Error("File upload failed");
          return key;
        })
      );
    }

    req.uploadedKeys = uploadedKeys;
    return next(); // ✅ Only one next() call
  } catch (error) {
    console.error("File upload error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process uploaded files" });
    }
  }
};


module.exports = uploadMiddleware;
