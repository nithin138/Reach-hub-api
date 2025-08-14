const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'seen', 'responded', 'closed'], default: 'new', index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
