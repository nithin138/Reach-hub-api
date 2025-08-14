import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { requireRole } from '../../middlewares/roleMiddleware.js';
import { createEnquiry, listMyEnquiriesForProvider, listMyEnquiriesForUser, updateEnquiryStatus } from './enquiry.controller.js';

const router = Router();

// user creates enquiry
router.post('/', protect, requireRole('user', 'admin'), createEnquiry);

// provider views enquiries about their services
router.get('/provider/me', protect, requireRole('provider', 'admin'), listMyEnquiriesForProvider);

// user views their enquiries
router.get('/user/me', protect, requireRole('user', 'admin'), listMyEnquiriesForUser);

// provider updates enquiry status
router.patch('/:id/status', protect, requireRole('provider', 'admin'), updateEnquiryStatus);

export default router;
