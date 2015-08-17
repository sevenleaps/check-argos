(function () {
  'use strict';

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
