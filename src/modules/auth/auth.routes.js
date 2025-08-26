const { Router } = require( 'express');
const { protect } = require( '../../middlewares/authMiddleware.js');
const {   sendOtp, verifyOtp, resetPassword, signup, login, me, refreshToken, logout 
 } = require( './auth.controller.js');

const router = Router();

router.post('/register', ...signup);
router.post('/login', ...login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, me);
router.post('/send-otp', ...sendOtp);
router.post('/verify-otp', ...verifyOtp);
router.post('/reset-password', ...resetPassword);


module.exports = router;
