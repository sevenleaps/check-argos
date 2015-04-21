(function () {
  'use strict';

  var express = require('express');
  var app = express();
  var routers = {};

  routers.stockCheck = express.Router();
  require('./config.js')(app, routers);

  require('./server/stock/stock_routes.js')(routers.stockCheck);

  module.exports = exports = app;
}());
