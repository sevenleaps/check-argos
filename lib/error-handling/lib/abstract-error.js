var util = require('util');

/*
 * AbstractError class wraps creates an Error object
 * with a custom message, captures the current stacktrace.
 *
 * @constructor
 * @param {String} message - the error message
 * @param {String} stack - the stack trace
 * @param {Function} constr - a constructor function which exists
 *        in the current stacktrace but should not be visible
 *        in the captured stacktrace.
 * @see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
 */
function AbstractError(message, stack, constr) {
  Error.call(this);
  Error.captureStackTrace(this, constr || this);
  this.stack = stack || '';
  this.message = message || '';
}

util.inherits(AbstractError, Error);

AbstractError.prototype.name = 'AbstractError';

AbstractError.prototype.toString = function toString() {
  var message = [this.name];
  this.message && (message.push(this.message));
  this.param && (message.push(JSON.stringify(this.param)));
  return message.join(': ');
};

module.exports = AbstractError;
