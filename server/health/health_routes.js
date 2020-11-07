(function () {
    'use strict';
    const status = {
        'startUp': new Date()
    }
  
    module.exports = exports = function (router) {
      router.route('/').get(function health(req, res) { res.send(status) })
    }
  })()