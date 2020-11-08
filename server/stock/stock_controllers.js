(function () {
  'use strict';
  var request = require('request');
  const $ = require('cheerio');

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  var customHeaderRequest = request.defaults({
      headers: {
        "User-Agent": "PostmanRuntime/7.26.2",
        "Connection": "keep-alive",
        "Accept": "*/*"
      }
    })
  var cache = require('memory-cache');

  module.exports = exports = {
    checkStock : checkStock,
    getPriceHistory : getPriceHistory,
    getPriceHistoryInternal : getPriceHistoryInternal
  };

  var inStockTTL = 90000;
  var outOfStockTTL = 420000;

  function getPriceHistory (req, res) {
    var url = 'http://pricehistory.swawk.com/v1/price/ARGOS_IE/' + req.params.productId + '/EUR';
    request(url, function onHistory(err, res, body) {
      if (err) {
        console.error('Error retrieving prices' + JSON.stringify(err));
        res.json([]);
      } else {
        var prices = JSON.parse(body) || [];
        res.json(prices);
      }
    });
  }

  function getPriceHistoryInternal (req, callback) {
    var url = 'http://pricehistory.swawk.com/v1/price/ARGOS_IE/' + req.params.productId + '/EUR';
    request(url, function onHistory(err, res, body) {
      if (err) {
        console.error('Error retrieving prices' + JSON.stringify(err));
        return callback(undefined, []);
      } else {
        var prices = JSON.parse(body) || [];
        return callback(undefined, prices);
      }
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
      //https://www.argos.ie/webapp/wcs/stores/servlet/CheckPriceAndStockCmd?storeId=10152&partNum=6799944&storeSelection=262
      var url = 'https://www.argos.ie/webapp/wcs/stores/servlet/CheckPriceAndStockCmd?storeId=10152&partNum=' + req.params.productId + '&storeSelection=' + req.params.storeId;
      //console.log(url)  
      customHeaderRequest(url, function onResponse(error, response, body) {
        stockStatus = {
          productId: req.params.productId,
          storeId: req.params.storeId,
          stockQuantity: 0
        };

        const storePickupSection = $(".storepickup", body);

        stockStatus.isStocked = isStocked(storePickupSection);
        stockStatus.isOrderable = isOrderable(storePickupSection);
        stockStatus.hasOutOfStockMessage = isOutOfStock(storePickupSection);

        if (stockStatus.isStocked) {
           stockStatus.stockQuantity = getStockQuantity(storePickupSection);
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

  function isStocked(section) {
    return $(".status", section).length > 0;
  }

  function isOrderable(section) {
    return $(".canbeordered", section).length > 0;
  }

  function getStockQuantity(section) {
    let stockQuant;
    const statusText = $(".status", section).text();
    try
    {
      const matches = statusText.match(/([0-9]+)/);
      stockQuant = matches[1];
    }
    catch(ex) {
      stockQuant = 'Error';
    }

    return stockQuant;
  }

  function isOutOfStock(section) {
    return $(".outofstock", section).length > 0;
  }

})();
