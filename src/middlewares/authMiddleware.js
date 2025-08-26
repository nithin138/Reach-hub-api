const { verifyAccess }  = require('../config/jwt.js');
const { Unauthorized, Forbidden } = require('../utils/error.js');

const protect = (req, res, next) => {
  const header = req.headers.authorization || '';
  console.log("Auth Header:", header);
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  console.log("Extracted Token:", token);
  
  if (!token) return next(Unauthorized());
  
  try {
    const decoded = verifyAccess(token);
    console.log("Decoded Token:", decoded);
    req.user = decoded; // { id, role, iat, exp }
    return next();
  } catch {
    return next(Unauthorized('Invalid or expired access token'));
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(Unauthorized());
  if (!roles.includes(req.user.role)) return next(Forbidden());
  next();
};

module.exports = { protect, requireRole };
