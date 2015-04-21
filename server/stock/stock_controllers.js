(function () {
  'use strict';
  var request = require('request');

  module.exports = exports = {
    checkStock : checkStock
  };

  function checkStock(req, res, next) {
    checkStockStatus(req, res, next, true);
  }

  function checkStockStatus(req, res, next, retry) {
    var url = 'http://www.argos.ie/webapp/wcs/stores/servlet/ISALTMStockAvailability?storeId=10152&langId=111&partNumber_1=' + req.params.productId + '&checkStock=true&backTo=product&storeSelection=' + req.params.storeId + '&viewTaskName=ISALTMAjaxResponseView';

    request(url, function onResponse(error, response, body) {
      var stockStatus = {
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

      var tryAgain = retry && !stockStatus.isStocked && !stockStatus.isOrderable && !stockStatus.hasOutOfStockMessage;

      if (tryAgain) {
        checkStockStatus(req, res, next, false);
      } else {
        res.status(200).json(stockStatus);
      }

    });
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
    return body.match(/([0-9]*) left to/)[1];
  }

  function isOrderable(body) {
    return body.indexOf('canBeOrdered') > -1;
  }

  function hasOutOfStockMessage(body) {
    return body.indexOf('outOfStock') > -1;
  }

})();
