const { Router } = require( 'express');
const { protect } = require( '../../middlewares/authMiddleware.js');
const { login, me, refresh, register, logout } = require( './auth.controller.js');

const router = Router();

router.post('/register', ...register);
router.post('/login', ...login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, me);

module.exports = router;
