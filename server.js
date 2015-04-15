(function () {
  'use strict';

  var app = require('./app.js');
  var port = 3000;
  app.listen(port);
  console.log('Listening on :' + port);
}());
