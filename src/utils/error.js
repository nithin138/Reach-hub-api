class ApiError extends Error {
  constructor(status, message, meta = {}) {
    super(message);
    this.status = status;
    this.meta = meta;
  }
}

const BadRequest = (msg = 'Bad Request', meta) => new ApiError(400, msg, meta);
const Unauthorized = (msg = 'Unauthorized', meta) => new ApiError(401, msg, meta);
const Forbidden = (msg = 'Forbidden', meta) => new ApiError(403, msg, meta);
const NotFoundErr = (msg = 'Not Found', meta) => new ApiError(404, msg, meta);
const Conflict = (msg = 'Conflict', meta) => new ApiError(409, msg, meta);
const InternalServerError = (msg = 'Internal Server Error', meta) => new ApiError(500, msg, meta);

module.exports = {
  ApiError,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFoundErr,
  Conflict,
  InternalServerError
};
