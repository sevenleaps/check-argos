(function () {
  'use strict';
  var controller = require('./search_controllers.js');

  module.exports = exports = function (router) {
    router.route('')
      .get(controller.textSearch);
  };
})();
