import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { requireRole } from '../../middlewares/roleMiddleware.js';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from './product.controller.js';

const router = Router();

// public
router.get('/', listProducts);
router.get('/:id', getProduct);

// provider/admin
router.post('/', protect, requireRole('provider', 'admin'), createProduct);
router.put('/:id', protect, requireRole('provider', 'admin'), updateProduct);
router.delete('/:id', protect, requireRole('provider', 'admin'), deleteProduct);

export default router;
