(function () {
  'use strict';
  var controller = require('./home_controllers.js');

  module.exports = exports = function (router) {
    router.route('/home')
        .get(controller.home);
  };
})();