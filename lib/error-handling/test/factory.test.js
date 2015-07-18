var expect = require('chai').expect;
var factory = require('../lib');

describe('factory', function () {
  var MyCustomError;

  before(function () {
    MyCustomError = factory('MyCustomError', 409, factory.INFO);
  });

  it('should create a custom error', function () {
    expect(MyCustomError).to.exist;
  });
});
