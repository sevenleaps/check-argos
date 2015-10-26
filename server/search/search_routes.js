(function () {
  'use strict';
  var controller = require('./search_controllers.js');

  module.exports = exports = function (router) {
    router.route('/advanced')
      .get(controller.textSearch);

    router.route('/simple')
        .get(controller.search);

      router.route('/')
            .get(controller.searchPage);
  };
})();
