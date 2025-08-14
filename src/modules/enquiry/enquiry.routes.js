const { Router } = require('express');
const { protect } = require('../../middlewares/authMiddleware.js');
const { requireRole } = require('../../middlewares/roleMiddleware.js');
const { createEnquiry, listMyEnquiriesForProvider, listMyEnquiriesForUser, updateEnquiryStatus } = require('./enquiry.controller.js');

const router = Router();

// user creates enquiry
router.post('/', protect, requireRole('user', 'admin'), createEnquiry);

// provider views enquiries about their services
router.get('/provider/me', protect, requireRole('provider', 'admin'), listMyEnquiriesForProvider);

// user views their enquiries
router.get('/user/me', protect, requireRole('user', 'admin'), listMyEnquiriesForUser);

// provider updates enquiry status
router.patch('/:id/status', protect, requireRole('provider', 'admin'), updateEnquiryStatus);

module.exports = router;
