(function () {
  'use strict';
  var controller = require('./product_controllers.js');

  module.exports = exports = function (router) {
    router.route('/:productId')
        .get(controller.product);
  };
})();
