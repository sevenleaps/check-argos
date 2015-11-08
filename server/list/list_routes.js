(function () {
  'use strict';
  var controller = require('./list_controllers.js');

  module.exports = exports = function (router) {
    router.route('/:productIds')
      .get(controller.customProductList);

      router.route('/')
      .get(controller.createList);

  };
})();
