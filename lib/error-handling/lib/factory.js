var util = require('util');
var AstractError = require('./abstract-error');

/**
 * Factory to create custom error functions.
 *
 * @param {String} name error name
 * @param {Number} httpCode HTTP error code to use in response
 * @param {Number} logLevel Bunyan's log level:
 *        trace(10), debug(20), info(30), warn(40), error(50), fatal (60).
 * @api public
 */
var factory = function factory(name, httpCode, logLevel) {
  /**
   * Custom error that allows to pass a message or error details, an optional Error object
   * to wrap, and an optional HTTP code to override the default one assigned to the error.
   * All parameters or arguments are optional and can be passed in any order.
   *
   * @param {String} message (optional) human-readable message giving more details about the error
   * @param {Object} param (optional) JSON object with the parameters and errors associated with them
   * @param {Error} innerError (optional) error object to nest or wrap by a new error object
   * @param {Number} httpCodeOverride (optional) specific
   * @api public
   */
  var CustomError = function CustomError() {
    this.name = name;
    this.logLevel = logLevel || 50;

    var message = [];
    var stack = '';
    var arg, args = Array.prototype.slice.call(arguments);

    while ((arg = args.pop())) {
      if (arg instanceof Error) {
        stack = arg.stack;
        message.push(arg.toString());
      } else if (typeof arg === 'number') {
        this.httpCode = arg;
      } else if (typeof arg === 'object') {
        this.param = arg;
      } else {
        message.unshift(arg);
      }
    }

    this.httpCode = this.httpCode || httpCode || 400; // default to 400

    // instantiate superclass 'AbstractError'
    AstractError.call(this, message.join(': '), stack, this.constructor);
  };

  util.inherits(CustomError, AstractError);
  CustomError.prototype.name = name;

  return CustomError;
};

factory.TRACE = 10;
factory.DEBUG = 20;
factory.INFO = 30;
factory.WARN = 40;
factory.ERROR = 50;
factory.FATAL = 60;

// Define public API
module.exports = factory;
