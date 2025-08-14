const { BadRequest } = require('../utils/error');

/**
 * validate({ body: zodSchema, query: zodSchema, params: zodSchema })
 */
const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.query) req.query = schemas.query.parse(req.query);
    if (schemas.params) req.params = schemas.params.parse(req.params);
    next();
  } catch (e) {
    next(BadRequest('Validation error', e.errors || e.issues || e));
  }
};

module.exports = { validate };
