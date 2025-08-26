const { Router } = require('express');
const { protect } = require('../../middlewares/authMiddleware.js');
const { requireRole } = require('../../middlewares/roleMiddleware.js');
const { listCategories, getCategory, createCategory, updateCategory, removeCategory } = require('./category.controller.js');
const { upload, uploadMiddleware } = require('../../middlewares/uploadMiddleware.js');

const router = Router();

// public
router.get('/', listCategories);
router.get('/:id', getCategory);

// admin only
router.post('/',upload.any(),uploadMiddleware,
    //  protect, requireRole('admin'),
      createCategory);
router.put('/:id', protect, requireRole('admin'), updateCategory);
router.delete('/:id', protect, requireRole('admin'), removeCategory);

module.exports = router;
