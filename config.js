(function () {
  'use strict';
  var morgan = require('morgan');
  var middleware = require('./middleware');
  var express = require('express');


  module.exports = exports = function (app, routes) {
    app.use(morgan('dev'));
    // console.log(middleware);

    process.on('unhandledRejection', onUncaughtException);
    process.on('uncaughtException', onUncaughtException);

    app.use('/templates', express.static(__dirname + '/server/views'));
    app.use('/assets', express.static(__dirname + '/server/assets'));
    app.use('/product', routes.product);
    app.use('/stockcheck', routes.stockCheck);
    app.use('/utilPages', routes.utilPages);
    // app.get(/.*/, function(req, res) {
    //     res.sendFile('down.html', {
    //         root: __dirname + '/public'
    //     });
    // });

    // api routes
    app.use('/api/stockcheck', routes.stockCheck);

    app.use('/search', routes.search);
    app.use('/popular', routes.popular);
    app.use('/product', routes.product);
    app.use('/', function(req, res, next) {
      if(req.query.search)
      {
        res.redirect('/search?q=' + req.query.search);
      }
      else if(req.query.popular){
        var days = req.query.popular;
        if(isNaN(days))
        {
          days = "2";
        }
        res.redirect('/popular/' + days);
      }
      else if(req.query.isClearance)
      {
        //Eventually do something here when clearance is back.
        routes.home(req, res, next);
      }
      else {
        routes.home(req, res, next);
      }
    });

    app.use('/about', routes.about);
    app.use('/clearance', routes.clearance);
    app.use('/list', routes.list);
    app.use(middleware.serverError);
    app.get('/StockCheckPage*', function(req, res) {
      res.redirect('/search?q=' + req.query.productId);
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
