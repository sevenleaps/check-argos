(function () {
  'use strict';
  var request = require('request')
  const $ = require('cheerio')
  const NodeCache = require( "node-cache" );
  const FIVE_MINUTES = 300
  const stockCache = new NodeCache({
    stdTTL: FIVE_MINUTES
  })

  var customHeaderRequest = request.defaults({
      headers: {
        "Host":"www.argos.ie",
        "User-Agent": "PostmanRuntime/7.26.2",
        "Connection": "keep-alive",
        "Accept": "*/*"
      }
    })
  var cache = require('memory-cache');

  module.exports = exports = {
    checkStock : checkStock
  }

  var inStockTTL = 90000;
  var outOfStockTTL = 420000;


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
    const cacheKey = `${req.params.storeId}${req.params.productId}`
    var stockStatus = stockCache.get(cacheKey)
    if (stockStatus === undefined) {
      //https://www.argos.ie/webapp/wcs/stores/servlet/CheckPriceAndStockCmd?storeId=10152&partNum=6799944&storeSelection=262
      var url = 'https://www.argos.ie/webapp/wcs/stores/servlet/CheckPriceAndStockCmd?storeId=10152&partNum=' + req.params.productId + '&storeSelection=' + req.params.storeId;
      //console.log(url)  
      customHeaderRequest(url, function onResponse(error, response, body) {
        stockStatus = {
          productId: req.params.productId,
          storeId: req.params.storeId,
          stockQuantity: 0
        };

        const accessDenied = $('TITLE', body).text() === 'Access Denied'
        if (accessDenied) {
          console.log('Access Denied')
        }
        const storePickupSection = $("storepickup", body);
        stockStatus.isStocked = isStocked(storePickupSection);
        stockStatus.isOrderable = isOrderable(storePickupSection);
        stockStatus.hasOutOfStockMessage = isOutOfStock(storePickupSection);

        if (stockStatus.isStocked) {
           stockStatus.stockQuantity = getStockQuantity(storePickupSection);
        }

        const badRequest = accessDenied || !stockStatus.isStocked && !stockStatus.isOrderable && !stockStatus.hasOutOfStockMessage;

        var tryAgain = retry && badRequest;
        if (tryAgain) {
          checkStockStatus(req, res, next, false);
        } else {
          if(stockStatus.hasOutOfStockMessage || stockStatus.isOrderable ){
            cacheTime = outOfStockTTL;
          }
          if (!badRequest) {
            stockCache.set(cacheKey, stockStatus)
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
