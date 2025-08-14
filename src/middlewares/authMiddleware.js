const { verifyAccess }  = require( '../config/jwt.js');
const { Unauthorized, Forbidden } = require( '../utils/errors.js');

export const protect = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return next(Unauthorized());
  try {
    const decoded = verifyAccess(token);
    req.user = decoded; // { id, role, iat, exp }
    return next();
  } catch {
    return next(Unauthorized('Invalid or expired access token'));
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(Unauthorized());
  if (!roles.includes(req.user.role)) return next(Forbidden());
  next();
};
