(function () {
  'use strict';
  var assert = require('assert');
  assert.ok(process.env.MONGODB_USERNAME, 'MONGODB_USERNAME is missing');
  assert.ok(process.env.MONGODB_PASSWORD, 'MONGODB_PASSWORD is missing');
  assert.ok(process.env.MONGODB_CONNECTION_URI, 'MONGODB_CONNECTION_URI is missing');
  var express = require('express');
  var app = express();
  var routers = {};

  routers.stockCheck = express.Router();
  routers.search = express.Router();
  require('./config.js')(app, routers);

  app.use(express.static(__dirname + '/public', '/'));

  require('./server/stock/stock_routes.js')(routers.stockCheck);
  require('./server/search/search_routes.js')(routers.search);

  module.exports = exports = app;
}());
