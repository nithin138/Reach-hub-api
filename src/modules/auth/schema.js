const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'provider', 'admin']).optional(),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
    role: z.enum(['user', 'provider', 'admin']).optional(),
});
const sendOtpSchema = z.object({
  email: z.string().email(),
});
const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(1)
});
const resetPasswordSchema = z.object({
    email: z.string().email(),
  password: z.string().min(1)
});

module.exports = { registerSchema, loginSchema,sendOtpSchema,verifyOtpSchema,resetPasswordSchema };
