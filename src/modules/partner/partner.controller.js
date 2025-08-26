const Partner = require("./partner.model.js");
const redisClient = require("../../config/redis"); // assume redis connection here
const crypto = require("crypto");

// Utility: generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Create partner (sign up)
// @route   POST /api/partners
exports.createPartner = async (req, res) => {
  try {
    const { name, email, phone, aadharCard, gst, address,image,coverPhoto } = req.body;

    // Check existing
    const existing = await Partner.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email/Phone already registered" });
    }

    const partner = new Partner({
      name,
      email,
      phone,
      aadharCard,
      gst,
      address,
      image, 
      coverPhoto,
      user:req.user.id
    });

    await partner.save();
    return res.status(201).json({ success: true, data: partner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate OTP (store in Redis, not DB)
// @route   POST /api/partners/send-otp
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

    const otp = generateOtp();
    await redisClient.setEx(`otp:${phone}`, 300, otp); // store 5 min

    // Simulate SMS gateway
    console.log(`OTP for ${phone}: ${otp}`);

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/partners/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ success: false, message: "Phone & OTP required" });

    const cachedOtp = await redisClient.get(`otp:${phone}`);
    if (!cachedOtp) return res.status(400).json({ success: false, message: "OTP expired or not found" });

    if (cachedOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP verified → delete it
    await redisClient.del(`otp:${phone}`);

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Partner Profile
// @route   GET /api/partners/:id
exports.getPartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: "Partner not found" });

    return res.status(200).json({ success: true, data: partner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Partner Profile
// @route   PUT /api/partners/:id
exports.updatePartner = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.imageUrl) updates.image = req.files.imageUrl;
    if (req.files?.coverPhotoUrl) updates.coverPhoto = req.files.coverPhotoUrl;

    const partner = await Partner.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!partner) return res.status(404).json({ success: false, message: "Partner not found" });

    return res.status(200).json({ success: true, data: partner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
