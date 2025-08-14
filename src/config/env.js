require('dotenv/config.js');

exports.env = {
  node: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),

  mongoUri: process.env.MONGODB_URI,

  jwt: {
    accessSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshTtl: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  corsOrigins: (process.env.CORS_ORIGIN || '*').split(',').map(s => s.trim()),

  redisUrl: process.env.REDIS_URL,

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
};
