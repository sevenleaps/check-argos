(function () {
    'use strict';
    const status = {
        'startUp': new Date()
    }
  
    module.exports = exports = function (router) {
      router.route('/')
          .get(function health(req, res) {
              console.log('got here')
            res.send(status)
          })
    }
  })()