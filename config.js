(function () {
  'use strict';
  var morgan = require('morgan');


  module.exports = exports = function (app, routes) {
    app.use(morgan('dev'));

    app.use('/stockcheck', routes.stockCheck);
    app.use('/textsearch', routes.textSearch);
  };


})();
