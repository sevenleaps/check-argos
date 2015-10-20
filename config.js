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
    app.use('/popular', routes.popular);
    app.use('/product', routes.product);
    app.use('/home', routes.home);
    app.use(middleware.serverError);
    app.get('/StockCheckPage*', function(req, res) {
      console.log('Got legacy request:', req.url);
      console.log('Product ID:', req.query.productId);
      res.redirect('/?search=' + req.query.productId);
    });
    app.get('/ebay', function(req, res) {
      console.log('Got legacy for ebay');
      res.redirect('http://ebayvenison.com');
    });
    app.get('/*Android.php*', function(req, res) {
      console.log('Got a legacy android app php link, ' + req.url);
      res.redirect('http://legacy.checkargos.com' + req.url);
    });
    app.get('/*.php*', function(req, res) {
      console.log('Got a legacy php link');
      res.redirect('/');
    });
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
