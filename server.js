(function () {
  'use strict';
  var domain = require('domain');
  var d = domain.create();

  d.on('error', function onError(err) {
    console.error(err);
  });

  var app = require('./app.js');
  var port = 3000;
  app.listen(port);
  console.log('Listening on :' + port);
}());
