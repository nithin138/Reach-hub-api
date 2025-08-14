const { validate } = require('../../middlewares/validate.js');
const { registerSchema, loginSchema } = require('./schema.js');
const { loginUser, refreshSession, registerUser, logoutSession } = require('./auth.service.js');
const { BadRequest } = require('../../utils/error.js');
const { env } = require('../../config/env.js');

const refreshCookieOpts = {
  httpOnly: true,
  secure: env.node === 'production',
  sameSite: 'lax',
  path: '/api/auth/refresh'
};

const register = [
  validate({ body: registerSchema }),
  async (req, res, next) => {
    try {
      const user = await registerUser(req.body);
      res.status(201).json({ 
        success: true, 
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
      });
    } catch (e) { 
      next(e); 
    }
  }
];

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

const refresh = async (req, res, next) => {
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

module.exports = { register, login, me, refresh, logout };
