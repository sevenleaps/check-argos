(function () {
  'use strict';
  var controller = require('./popular_controllers.js');

  module.exports = exports = function (router) {
    router.route('/recent')
      .get(controller.getPopular);
  };
})();
