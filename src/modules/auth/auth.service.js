const { v4: uuid } = require('uuid');
const User = require('./auth.model.js');
const { signAccess, signRefresh, verifyRefresh } = require('../../config/jwt.js');
const ms = require('ms');
const { storeRefresh, consumeRefresh, revokeRefresh } = require('./session.store.js');
const { env } = require('../../config/env.js');
const { sendEmail } = require('../../utils/email.js');
const { redis } = require('../../config/redis.js');

// ---------------- OTP ----------------
const OTP_TTL = 500; // 5 min
const sendOtpService = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp:${email}`, otp, { EX: OTP_TTL });
  await sendEmail(email,'Your OTP Code',`Your OTP is: <b>${otp}</b>`)};
const verifyOtpService = async (email, otp) => {
  const cached = await redis.get(`otp:${email}`);
  if (!cached) throw new Error('OTP expired or not found');
  if (cached !== otp) throw new Error('Invalid OTP');

  await redis.del(`otp:${email}`);
  return true;
};
const resetPasswordService = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  user.password = newPassword;
  await user.save();
};


const registerUser = async ({ name, email, password, role = 'user', phone }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already in use');
  const user = await User.create({ name, email, password, role, phone });
  return user;
};

const loginUser = async ({ email, password, role }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
    // role conflict check
  if (role && user.role !== role) {
    throw new Error(`This email is already registered with a ${user.role}`);
  }
  const ok = await user.matchPassword(password);
  if (!ok) throw new Error('Invalid credentials');

  // tokens
  const accessToken = signAccess({ id: user._id, role: user.role });
  const jti = uuid();
  const refreshToken = signRefresh({ id: user._id, role: user.role, jti });

  // store refresh in redis with TTL
  const ttlSec = Math.floor(ms(env.jwt.refreshTtl) / 1000);
  await storeRefresh(jti, user._id, ttlSec);

  return { user, accessToken, refreshToken };
};

const refreshSession = async (token) => {
  const decoded = verifyRefresh(token); // throws if invalid/expired
  const userId = await consumeRefresh(decoded.jti);
  if (!userId) throw new Error('Refresh revoked or not found');

  // rotate refresh
  await revokeRefresh(decoded.jti);
  const newJti = uuid();
  const newRefresh = signRefresh({ id: decoded.id, role: decoded.role, jti: newJti });
  const ttlSec = Math.floor(ms(env.jwt.refreshTtl) / 1000);
  await storeRefresh(newJti, decoded.id, ttlSec);

  const access = signAccess({ id: decoded.id, role: decoded.role });

  return { accessToken: access, refreshToken: newRefresh };
};

const logoutSession = async (refreshToken) => {
  try {
    const decoded = verifyRefresh(refreshToken);
    await revokeRefresh(decoded.jti);
  } catch {
    // ignore invalid token on logout
  }
};

module.exports = { 
  sendOtpService, verifyOtpService, resetPasswordService,
  registerUser, loginUser, refreshSession, logoutSession 
};
