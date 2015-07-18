(function () {
  'use strict';
  var morgan = require('morgan');
  var middleware = require('./middleware');


  module.exports = exports = function (app, routes) {
    app.use(morgan('dev'));
    // console.log(middleware);

    process.on('unhandledRejection', onUncaughtException);
    process.on('uncaughtException', onUncaughtException);

    app.use('/stockcheck', routes.stockCheck);
    app.use('/search', routes.search);
    app.use(middleware.serverError);
  };

  // Catch the uncaught errors that weren't wrapped in a domain or try catch statement.
  function onUncaughtException(err) {
    console.log('Uncaught exception:', err);

    // delay exit to allow error to be reported to Rollbar
    setTimeout(process.exit.bind(null, 1), 2000);

    // avoid reporting more errors while the process is waiting to be killed
    process.removeListener('unhandledRejection', onUncaughtException);
    process.removeListener('uncaughtException', onUncaughtException);
  }


})();
