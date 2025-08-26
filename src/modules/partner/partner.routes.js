const express = require("express");
const router = express.Router();
const partnerController = require("./partner.controller.js");
const { upload, uploadMiddleware } = require("../../middlewares/uploadMiddleware.js");
const { protect } = require("../../middlewares/authMiddleware.js");

// Partner signup
router.post("/", 
   upload.any(), uploadMiddleware,
   protect,
     partnerController.createPartner);

// OTP routes
router.post("/send-otp", partnerController.sendOtp);
router.post("/verify-otp", partnerController.verifyOtp);

// Partner profile
router.get("/:id", partnerController.getPartner);
router.put("/:id", 
    // uploadMiddleware, 
    partnerController.updatePartner);

module.exports = router;
