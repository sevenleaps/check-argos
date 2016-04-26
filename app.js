(function () {
  'use strict';
  var assert = require('assert');
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
  routers.about = express.Router();
  routers.clearance = express.Router();
  routers.list = express.Router();
  routers.utilPages = express.Router();
  require('./config.js')(app, routers);

  app.use(express.static(__dirname + '/public', '/'));

  require('./server/stock/stock_routes.js')(routers.stockCheck);
  require('./server/search/search_routes.js')(routers.search);
  require('./server/popular/popular_routes.js')(routers.popular);
  require('./server/product/product_routes.js')(routers.product);
  require('./server/home/home_routes.js')(routers.home);
  require('./server/about/about_routes.js')(routers.about);
  require('./server/clearance/clearance_routes.js')(routers.clearance);
  require('./server/list/list_routes.js')(routers.list);
  require('./server/util-pages/util_pages_routes.js')(routers.utilPages);

  module.exports = exports = app;
}());
