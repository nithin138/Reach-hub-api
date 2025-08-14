const { Router } = require('express');
const { protect } = require('../../middlewares/authMiddleware.js');
const { requireRole } = require('../../middlewares/roleMiddleware.js');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('./product.controller.js');

const router = Router();

// public
router.get('/', listProducts);
router.get('/:id', getProduct);

// provider/admin
router.post('/', protect, requireRole('provider', 'admin'), createProduct);
router.put('/:id', protect, requireRole('provider', 'admin'), updateProduct);
router.delete('/:id', protect, requireRole('provider', 'admin'), deleteProduct);

export default router;
