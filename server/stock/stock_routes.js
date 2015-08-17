(function () {
  'use strict';
  var controller = require('./stock_controllers.js');

  module.exports = exports = function (router) {
    router.route('/price/:productId')
      .get(controller.getPriceHistory);
    router.route('/:storeId/:productId')
      .get(controller.checkStock);
  };
})();
