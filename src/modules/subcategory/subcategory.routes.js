const { Router } = require('express');
const { protect } = require('../../middlewares/authMiddleware.js');
const { requireRole } = require('../../middlewares/roleMiddleware.js');
const {
  listSubcategories, getSubcategory, createSubcategory, updateSubcategory, removeSubcategory,
  listByCategorySlug
} = require('./subcategory.controller.js');

const router = Router();

// public
router.get('/', listSubcategories);
router.get('/:id', getSubcategory);
router.get('/by-category-slug/:slug', listByCategorySlug);

// admin only
router.post('/', protect, requireRole('admin'), createSubcategory);
router.put('/:id', protect, requireRole('admin'), updateSubcategory);
router.delete('/:id', protect, requireRole('admin'), removeSubcategory);

export default router;
