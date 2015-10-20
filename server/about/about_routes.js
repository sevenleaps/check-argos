(function () {
  'use strict';
  var controller = require('./about_controllers.js');

  module.exports = exports = function (router) {
    router.route('/')
        .get(controller.home);
  };
})();