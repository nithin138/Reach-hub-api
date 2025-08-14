const { Router } = require('express');
const { protect } = require('../../middlewares/authMiddleware.js');
const { requireRole } = require('../../middlewares/roleMiddleware.js');
const { listServices, getService, createService, updateService, deleteService } = require('./service.controller.js');
const { upload } = require('../../utils/fileUpload.js');

const router = Router();

router.get('/', listServices);
router.get('/:id', getService);
router.post('/', protect, requireRole('provider', 'admin'), upload.array('images', 5), createService);
router.put('/:id', protect, requireRole('provider', 'admin'), updateService);
router.delete('/:id', protect, requireRole('provider', 'admin'), deleteService);

module.exports = router;
