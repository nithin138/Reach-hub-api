import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { requireRole } from '../../middlewares/roleMiddleware.js';
import {
  listSubcategories, getSubcategory, createSubcategory, updateSubcategory, removeSubcategory,
  listByCategorySlug
} from './subcategory.controller.js';

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
