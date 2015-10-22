(function () {
  'use strict';
  var controller = require('./clearance_controllers.js');

  module.exports = exports = function (router) {
    router.route('/')
        .get(controller.clearance);
  };
})();
