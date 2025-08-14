import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { requireRole } from '../../middlewares/roleMiddleware.js';
import { listCategories, getCategory, createCategory, updateCategory, removeCategory } from './category.controller.js';

const router = Router();

// public
router.get('/', listCategories);
router.get('/:id', getCategory);

// admin only
router.post('/', protect, requireRole('admin'), createCategory);
router.put('/:id', protect, requireRole('admin'), updateCategory);
router.delete('/:id', protect, requireRole('admin'), removeCategory);

export default router;
