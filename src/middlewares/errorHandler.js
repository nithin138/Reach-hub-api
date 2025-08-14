const { ApiError } =  require('../utils/error');

exports.notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

exports.errorHandler = (err, req, res, next) => {
  const status = err instanceof ApiError ? err.status : (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  const payload = {
    success: false,
    message: err.message || 'Server error'
  };
  if (err.meta) payload.meta = err.meta;
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack;
  res.status(status).json(payload);
};
