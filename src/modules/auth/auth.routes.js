const { Router } = require( 'express');
const { protect } = require( '../../middlewares/authMiddleware.js');
const { login, me, refreshToken, signup, logout } = require( './auth.controller.js');

const router = Router();

router.post('/register', ...signup);
router.post('/login', ...login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, me);

module.exports = router;
