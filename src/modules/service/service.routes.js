import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { requireRole } from '../../middlewares/roleMiddleware.js';
import { listServices, getService, createService, updateService, deleteService } from './service.controller.js';
import { upload } from '../../utils/fileUpload.js';

const router = Router();

router.get('/', listServices);
router.get('/:id', getService);
router.post('/', protect, requireRole('provider', 'admin'), upload.array('images', 5), createService);
router.put('/:id', protect, requireRole('provider', 'admin'), updateService);
router.delete('/:id', protect, requireRole('provider', 'admin'), deleteService);

export default router;
