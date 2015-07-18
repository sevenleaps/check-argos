var factory = require('./factory');

// General errors
factory.DatabaseError = factory('DatabaseError', 500, factory.ERROR);
factory.ServerError = factory('ServerError', 500, factory.ERROR);
factory.ArgosResponseError = factory('ArgosResponseError', 500, factory.WARN);

// HTTP-related errors
factory.BadRequestError = factory('BadRequestError', 400, factory.WARN);
factory.UnauthorizedError = factory('UnauthorizedError', 401, factory.WARN);
factory.NotFoundError = factory('NotFoundError', 404, factory.WARN);
factory.ForbiddenError = factory('ForbiddenError', 403, factory.WARN);
factory.NotAcceptableError = factory('NotAcceptableError', 406, factory.WARN);
factory.ValidationError = factory('ValidationError', 422, factory.WARN);

// Express.js middleware for error handling
factory.middleware = require('./middleware');

exports = module.exports = factory;
