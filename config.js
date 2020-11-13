(function () {
  'use strict';
  var morgan = require('morgan');
  var express = require('express');

  module.exports = exports = function (app, routes) {
    app.use(morgan(':date[iso] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'))

    process.on('unhandledRejection', onUncaughtException);
    process.on('uncaughtException', onUncaughtException);

    app.use('/templates', express.static(__dirname + '/server/views'));
    app.use('/assets', express.static(__dirname + '/server/assets'));
    app.use('/product', routes.product);
    app.use('/stockcheck', routes.stockCheck);
    app.use('/utilPages', routes.utilPages);

    // api routes
    app.use('/api/stockcheck', routes.stockCheck);

    app.use('/search', routes.search);
    app.use('/health', routes.health);
    app.use('/product', routes.product);
    app.use('/', function(req, res, next) {
      if(req.query.search)
      {
        res.redirect('/search?q=' + req.query.search);
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
    app.get('/StockCheckPage*', function(req, res) {
      res.redirect('/search?q=' + req.query.productId);
    });
    app.get('/ebay', function(req, res) {
      console.log('Got legacy for ebay');
      res.redirect('http://ebayvenison.com');
    });
    app.get('/*Android.php*', function(req, res) {
      console.log('Got a legacy android app php link, ' + req.url);
      res.redirect('/');
    });
    app.get('/*.php*', function(req, res) {
      console.log('Got a legacy php link');
      res.redirect('/');
    });
    app.get('/index.html', function(req, res) {
      console.log('Got an old index.html link');
      res.redirect('/');
    });

    app.use( (err, req, res, next) => {
      console.log(err)
      res.status(500).send('Argos website is a Pile of shite, please try again. If you think you can improve check argos, it is open source now https://github.com/sevenleaps/check-argos')
    })
  };

  // Catch the uncaught errors that weren't wrapped in a domain or try catch statement.
  function onUncaughtException(err) {
    console.log('Uncaught exception:', err);
  }
})();
