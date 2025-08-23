const { validate } = require('../../middlewares/validate.js');
const { registerSchema, loginSchema, sendOtpSchema, verifyOtpSchema, resetPasswordSchema } = require('./schema.js');

const { loginUser, refreshSession, registerUser, logoutSession, sendOtpService, verifyOtpService, resetPasswordService } = require('./auth.service.js');

const { BadRequest } = require('../../utils/error.js');
const { env } = require('../../config/env.js');

const refreshCookieOpts = { httpOnly: true, secure: env.node === 'production', sameSite: 'lax', path: '/api/auth/refresh' };


// send OTP
const sendOtp = [
  validate({ body: sendOtpSchema }),
  async (req, res, next) => {
    try {
      await sendOtpService(req.body.email);
      res.json({ success: true, message: 'OTP sent successfully' });
    } catch (e) {
      next(BadRequest(e.message));
    }
  }
];

// verify OTP
const verifyOtp = [
  validate({ body: verifyOtpSchema }),
  async (req, res, next) => {
    try {
      const verified = await verifyOtpService(req.body.email, req.body.otp);
      res.json({ success: verified, message: 'OTP verified' });
    } catch (e) {
      next(BadRequest(e.message));
    }
  }
];

// reset password
const resetPassword = [
  validate({ body: resetPasswordSchema }),
  async (req, res, next) => {
    try {
      await resetPasswordService(req.body.email, req.body.newPassword, req.body.otp);
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (e) {
      next(BadRequest(e.message));
    }
  }
];

// signup
const signup = [
  validate({ body: registerSchema }),
  async (req, res, next) => {
    try {
      const user = await registerUser(req.body);
      res.status(201).json({ 
        success: true, 
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
      });
    } catch (e) { next(e); }
  }
];

// login
const login = [
  validate({ body: loginSchema }),
  async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await loginUser(req.body);
      res.cookie('refreshToken', refreshToken, refreshCookieOpts);
      res.json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        accessToken
      });
    } catch (e) { 
      next(BadRequest(e.message)); 
    }
  }
];

const me = async (req, res) => {
  res.json({ success: true, user: req.user });
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new Error('Missing refresh token');
    const { accessToken, refreshToken } = await refreshSession(token);
    res.cookie('refreshToken', refreshToken, refreshCookieOpts);
    res.json({ success: true, accessToken });
  } catch (e) { 
    next(BadRequest(e.message)); 
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) await logoutSession(token);
    res.clearCookie('refreshToken', refreshCookieOpts);
    res.json({ success: true, message: 'Logged out' });
  } catch (e) { 
    next(e); 
  }
};

module.exports = { 
  sendOtp, verifyOtp, resetPassword, signup, login, me, refreshToken, logout 
};
