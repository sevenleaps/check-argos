(function () {
  'use strict';

  var express = require('express');
  var app = express();
  var routers = {};

  routers.stockCheck = express.Router();
  routers.textSearch = express.Router()
  require('./config.js')(app, routers);

  require('./server/stock/stock_routes.js')(routers.stockCheck);
  require('./server/search/search_routes.js')(routers.textSearch);

  module.exports = exports = app;
}());
