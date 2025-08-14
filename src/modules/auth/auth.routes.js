import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { login, me, refresh, register, logout } from './auth.controller.js';

const router = Router();

router.post('/register', ...register);
router.post('/login', ...login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, me);

export default router;
