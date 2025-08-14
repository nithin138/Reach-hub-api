import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware.js';

const router = Router();

router.get('/me', protect, (req, res) => res.json({ id: req.user.id, role: req.user.role }));

export default router;
