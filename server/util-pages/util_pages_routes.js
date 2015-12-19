(function () {
  'use strict';
  var controller = require('./util_pages_controllers.js');

  module.exports = exports = function (router) {
    router.route('/addAll')
        .get(controller.addAllStores);
  };
})();
