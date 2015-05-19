(function () {
  'use strict';


  var app = require('./app.js');

  app.on('error', function onError(err) {
    console.error(err);
  });

  var port = 3000;
  app.listen(port);
  console.log('Listening on :' + port);
}());
