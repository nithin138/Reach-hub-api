const express = require("express");
const router = express.Router();
const partnerController = require("./partner.controller.js");
// const uploadMiddleware = require("../../middlewares/uploadMiddleware"); // handles image uploads

// Partner signup
router.post("/", 
    // uploadMiddleware,
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
