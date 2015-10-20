(function () {
  'use strict';
  var assert = require('assert');
  assert.ok(process.env.MONGODB_USERNAME, 'MONGODB_USERNAME is missing');
  assert.ok(process.env.MONGODB_PASSWORD, 'MONGODB_PASSWORD is missing');
  assert.ok(process.env.MONGODB_CONNECTION_URI, 'MONGODB_CONNECTION_URI is missing');
  var express = require('express');
  var app = express();
  var routers = {};
  var path = require('path');

  app.set('views', path.join(__dirname, 'server/views'));
  app.set('view engine', 'hjs');

  routers.stockCheck = express.Router();
  routers.search = express.Router();
  routers.popular = express.Router();
  routers.product = express.Router();
  routers.home = express.Router();
  require('./config.js')(app, routers);

  app.use(express.static(__dirname + '/public', '/'));

  require('./server/stock/stock_routes.js')(routers.stockCheck);
  require('./server/search/search_routes.js')(routers.search);
  require('./server/popular/popular_routes.js')(routers.popular);
  require('./server/product/product_routes.js')(routers.product);
  require('./server/home/home_routes.js')(routers.home);

  module.exports = exports = app;
}());
