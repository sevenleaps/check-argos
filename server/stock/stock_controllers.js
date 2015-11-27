(function () {
  'use strict';
  var request = require('request');
  var mongodb = require('mongodb-then');
  var cache = require('memory-cache');

  var connecitonURI = process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + process.env.MONGODB_CONNECTION_URI;
  var db = mongodb(connecitonURI + 'checkargos', [
    'product','price'
  ]);

  module.exports = exports = {
    checkStock : checkStock,
    getPriceHistory : getPriceHistory,
    getPriceHistoryInternal : getPriceHistoryInternal
  };

  var inStockTTL = 90000;
  var outOfStockTTL = 420000;

  function getPriceHistory (req, res) {
    db.price.find({'productId': Number.parseInt(req.params.productId)}).sort({'day': 1}).then(function (prices) {
      res.json(prices);
    }).catch(function (error) {
      console.error('Error retrieving prices' + JSON.stringify(error));
      res.json([]);
    });
  }

  function getPriceHistoryInternal (req, callback) {
    db.price.find({'productId': Number.parseInt(req.params.productId)}).sort({'day': 1}).then(function (prices) {
      return callback(undefined, prices);
    }).catch(function (error) {
      console.error('Error retrieving prices' + JSON.stringify(error));
      return callback(error);
    });
  }

  function checkStock(req, res, next) {
    try{
      checkStockStatus(req, res, next, true);
    }
    catch(ex){
      console.error('Catch');
      console.error(ex);
      res.status(500).send('Error with request');
    }
  }

  function checkStockStatus(req, res, next, retry) {
    var cacheTime = inStockTTL;
    var stockStatus = cache.get(''+req.params.storeId+req.params.productId);
    if(stockStatus === null){
      var url = 'http://www.argos.ie/webapp/wcs/stores/servlet/ISALTMStockAvailability?storeId=10152&langId=111&partNumber_1=' + req.params.productId + '&checkStock=true&backTo=product&storeSelection=' + req.params.storeId + '&viewTaskName=ISALTMAjaxResponseView';
      request(url, function onResponse(error, response, body) {

        stockStatus = {
          productId: req.params.productId,
          storeId: req.params.storeId,
          stockQuantity: 0
        };

        if (isNearStoreIncluded(body)) {
          body = getFirstStoreSource(body);
        }

        stockStatus.isStocked = isStocked(body);
        stockStatus.isOrderable = isOrderable(body);
        stockStatus.hasOutOfStockMessage = hasOutOfStockMessage(body);

        if (isStocked(body)) {
          stockStatus.stockQuantity = getStockQuantity(body);
        }

        var badRequest = !stockStatus.isStocked && !stockStatus.isOrderable && !stockStatus.hasOutOfStockMessage;

        var tryAgain = retry && badRequest;
        if (tryAgain) {
          checkStockStatus(req, res, next, false);
        } else {
          if(stockStatus.hasOutOfStockMessage || stockStatus.isOrderable ){
            cacheTime = outOfStockTTL;
          }
          if (!badRequest) {
            cache.put(''+req.params.storeId+req.params.productId, stockStatus, cacheTime);
          }
          res.status(200).json(stockStatus);
        }
      });
    }else{
      res.status(200).json(stockStatus);
   }
  }

  function isNearStoreIncluded(body) {
    return body.indexOf('storePickup2') > -1;
  }

  function getFirstStoreSource(body) {
    return body.split('<td class=\\\"storePickup2\\\">')[0];
  }

  function isStocked(body) {
    return body.indexOf('inStock') > -1;
  }

  function getStockQuantity(body) {
    var stockQuant;
    try
    {
      stockQuant = body.match(/([0-9]*) left to/)[1];
    }
    catch(ex) {
      stockQuant = 'Error';
    }

    return stockQuant;
  }

  function isOrderable(body) {
    return body.indexOf('canBeOrdered') > -1;
  }

  function hasOutOfStockMessage(body) {
    return body.indexOf('outOfStock') > -1;
  }

})();
