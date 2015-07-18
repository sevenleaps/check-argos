var expect = require('chai').expect;
var factory = require('../lib');
var net = require('net');

describe('CustomError', function () {
  var MyCustomError;

  before(function () {
    MyCustomError = factory('MyCustomError', 409, factory.WARN);
  });

  it('should create a error with a given message', function () {
    var error = new MyCustomError('something bad happened');
    expect(error.message).to.equal('something bad happened');
  });

  it('should create a error keeping its default log level', function () {
    var error = new MyCustomError('something bad happened');
    expect(error.logLevel).to.equal(factory.WARN);
  });

  it('should create a error keeping its default HTTP code', function () {
    var error = new MyCustomError('something bad happened');
    expect(error.httpCode).to.equal(409);
  });

  it('should create a custom error without a message', function () {
    var error = new MyCustomError();
    expect(error.message).to.equal('');
  });

  it('should create a error with a custom HTTP code', function () {
    var error = new MyCustomError('something bad happened', 422);
    expect(error.httpCode).to.equal(422);
  });

  it('should create a custom error with nested/inner error', function (done) {
    function shouldReturnError(callback) {
      var server = net.connect({path: 'nonexistent'});
      server.on('error', function (err) {
        callback(new MyCustomError(err));
      });
    }
    shouldReturnError(function (err) {
      expect(err).to.exist;
      expect(err).to.have.property('stack');
      expect(err.message).to.equal('Error: connect ENOENT');
      done();
    });
  });

  it('should allow any order for the error arguments', function () {
    var error = new MyCustomError(412, 'something bad happened', new Error('nested error'));
    expect(error.message).to.equal('something bad happened: Error: nested error');
    expect(error.httpCode).to.equal(412);
  });
});
