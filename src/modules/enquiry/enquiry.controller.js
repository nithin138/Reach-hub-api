const Enquiry = require('./enquiry.model.js');
const Service = require('../service/service.model.js');
const { sendEmail } = require('../../utils/email.js');

const createEnquiry = async (req, res, next) => {
  try {
    const { serviceId, message } = req.body;
    const service = await Service.findById(serviceId).lean();
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const enquiry = await Enquiry.create({
      serviceId,
      userId: req.user.id,
      providerId: service.providerId,
      message
    });

    // socket notify provider
    const io = req.app.get('io');
    io.to(String(service.providerId)).emit('enquiry:new', { enquiryId: enquiry._id });

    // email (basic)
    try {
      await sendEmail({
        to: 'provider@example.com', // TODO: replace with actual provider email lookup
        subject: 'New enquiry received',
        html: `<p>You have a new enquiry for ${service.title}.</p><p>Message: ${message}</p>`
      });
    } catch (err) {
      console.error('[Email Error]', err.message);
    }

    res.status(201).json(enquiry);
  } catch (e) {
    next(e);
  }
};

const listMyEnquiriesForProvider = async (req, res, next) => {
  try {
    const items = await Enquiry.find({ providerId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
};

const listMyEnquiriesForUser = async (req, res, next) => {
  try {
    const items = await Enquiry.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
};

const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['seen', 'responded', 'closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: req.params.id, providerId: req.user.id },
      { $set: { status } },
      { new: true }
    );

    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(enquiry);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createEnquiry,
  listMyEnquiriesForProvider,
  listMyEnquiriesForUser,
  updateEnquiryStatus
};
