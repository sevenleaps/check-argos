(function () {
  'use strict';
  var request = require('request');
  var async = require('async');

  var customHeaderRequest = request.defaults({
    headers: {
      'User-Agent': "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0",
      "Connection": "keep-alive",
      "Accept": "*/*"
    }
  })

  exports.getProductsFromHtml =  function (body) {

    var items = getArrayOfHtmlForEachProduct(body);

    var itemsList = [];
    items.forEach (function (entry){
      itemsList.push(getItemObject(entry));
    });

    return itemsList;
  };

  exports.isListOfProductsPage = function (body) {
    console.log("got into list of products page");
    var items = body.split('<li class="producttitle">');
    var isValidProductPage = (items !== null && items.length > 1);
    console.log(isValidProductPage);
    console.log(body);
    return isValidProductPage;
  };

  exports.getTotalNumberOfProducts = function (body) {

    var items = body.split('<li class="producttitle">');
    var numProducts;

    try{
      numProducts = items[0].match(/of\s<span>([0-9]*)<\/span>/)[1];
    }
    catch (ex){
      numProducts = 'Error';
    }
    console.log("numProducts " + numProducts);
  	return numProducts;
  };

  exports.isFoundNoProductsPage = function (body) {

    return (body.indexOf('Sorry we didn\'t find an exact match.') > -1) || (body.indexOf('Sorry we didn\'t find any results.') > -1);
  };

  exports.cleanUpProductId = function(productId) {
    return cleanUpProductId(productId);
  };

  function cleanUpProductId(productId) {

    productId = productId.replace(/ /g, '');
    productId = productId.replace(/\//g, '');

    return productId;
  }

  exports.isValidProductId = function (productId) {

    productId = cleanUpProductId(productId);

    var hasMatch = productId.match(/\d{7}/) !== null;
    return hasMatch;
  };

  var getProductPageHtml = exports.getProductPageHtml = function (productId, callback){
    var productUrl = 'https://www.argos.ie/static/Product/partNumber/' + productId +'.htm';
    customHeaderRequest(productUrl, callback);
  };

  function getProductPageFromQuery (productId, callback) {
    var productUrl = 'https://www.argos.ie/webapp/wcs/stores/servlet/Search?storeId=10152&catalogId=14551&langId=111&searchTerms=' + productId;
    customHeaderRequest(productUrl, callback);
  };

  var isValidProductPage = exports.isValidProductPage = function (body){
    var hasPageContent = !(body.match(/[a-zA-Z]/) === null);
    var isValidPage = body.indexOf('Sorry, we are unable to find the catalogue number(s) highlighted in your list.') <= -1;
    return hasPageContent && isValidPage;
  };

  var getProductInformationFromProductPage = exports.getProductInformationFromProductPage = function (body) {

    return {
      productId: getProductId(body),
      productName: getProductName(body),
      price: getProductPrice(body),
      previousPrice: getPreviousPrice(body),
      productImageUrl: getProductImageUrl(body),
      availableForReservation: getIsAvailableForReservation(body),
      availableForOnlinePurchase: getIsAvailableForOnlineBuying(body)

    };
  };

  exports.isSpecialCatagotyPage = function (path) {
    return (path.indexOf('category_root') > -1);
  };

  exports.getCatagoryInformationFromPath = function (path) {

    console.log(path);
    // var catagoryName = path.match(/category_root\|([^\|]*)/)[1];
    // var subCatagoryNumber = path.match(/category_root\|[^\|]*\|(\d*)/)[1];
    // var match = path.match(/cat_[^\|]*\|([^\|]*)\|(\d*)/);
    // var catagoryNumber = match[2];
    // var subCatagoryName = match[1];
    path =  decodeURIComponent(path);
    var match = path.match(/category_root\|([^\|]*)\|(\d*)\//);
    var catagoryName = match[1];
    var catagoryNumber = match[2];

    match = path.match(/cat_[^\|]*\|([^\|]*)\|(\d*)/);
    var subCatagoryName = match[1];
    var subCatagoryNumber = match[2];


    return {
      catagoryName : catagoryName,
      catagoryNumber : catagoryNumber,
      subCatagoryNumber : subCatagoryNumber,
      subCatagoryName : subCatagoryName
    };
  };

  exports.getProductDetailsFromProductList = function (productIds, limit, offset, callback)
  {
    offset = offset || 0;

    if(limit)
    {
      console.log(offset + limit);
      var cutOff = parseInt(offset) + parseInt(limit);
      if(cutOff > productIds.length)
      {
        cutOff = productIds.length - parseInt(offset);
      }

      productIds = productIds.slice(offset, cutOff);
    }

    async.each(productIds, getProductInformation, function done (err) {
      removeItemsThatNoLongerExist(productIds);
      callback(null, productIds);
    });

  };

  var getProductInformation = exports.getProductInformation = function (product, callback)
  {
    var productHtml = getProductPageHtml(product.productId, function onResponse(error, response, body)
    {
      var productPageHtml = body;
      if(isValidProductPage(productPageHtml))
      {
        var productInfo = {};
        try {
          var productInfo = getProductInformationFromProductPage(productPageHtml);
          mapProductInfoToProduct(product, productInfo);
          callback();
        } catch (e) {
          //Loading the static page did not work, trying from query
          getProductInformationFromQueryPage(product, callback)
        }
      }
      else {
        callback();
      }
    });
  };

  function getProductInformationFromQueryPage (product, callback) {
    var productHtml = getProductPageFromQuery(product.productId, function onResponse(error, response, body)
    {
      var productPageHtml = body;
      if(isValidProductPage(productPageHtml))
      {
        var productInfo = getProductInformationFromProductPage(productPageHtml);
        mapProductInfoToProduct(product, productInfo);
      }

      callback();
    });
  }

  function mapProductInfoToProduct(product, productInfo){
    var percentageSaving = 0;
    product.productName = productInfo.productName;
    product.price = productInfo.price;
    product.previousPrice = productInfo.previousPrice;
    product.productImageUrl = productInfo.productImageUrl;
    if(productInfo.previousPrice != 0 && productInfo.price != "."){
      percentageSaving = ((1 - (product.price/product.previousPrice))* 100).toFixed(0);
    }
    product.percentageSaving = percentageSaving;
  }

  function removeItemsThatNoLongerExist(productList)
  {
    productList.forEach(function(item, index, object) {
      if (!item.productName)
      {
        object.splice(index, 1);
      }
    });
  }

  function getItemObject(htmlItem)
  {
    return {
      productId: cleanUpProductId(getProductIdFromListItem(htmlItem)),
      productName: getProductNameFromListItem(htmlItem),
      price: getProductPriceFromListItem(htmlItem),
      previousPrice: getPreviousPriceFromListItem(htmlItem),
      productImageUrl: getProductImageUrlFromListItem(htmlItem)

    };
  }

  function getProductId(body){
    var productId;
    try{
      productId = body.match(/class="partnumber">(.*)<\/span\>/)[1];
    }
    catch(ex){
      console.log(ex);
      productId = 'Error';
    }

    return cleanUpProductId(productId);
  }

  function getProductName(body){
    var pageTitle = getPageTitle(body);
    var productName;
    try
    {
      productName = pageTitle.split('at Argos.ie')[0];
      productName = productName.replace(/Buy /g, '');
    }
    catch (ex)
    {
      productName = 'Error';
    }

    return productName;
  }

  function getIsAvailableForReservation(body)
  {
    return (body.indexOf('/wcsstore/argosie/en_IE/images/p1/icon_isaltmc_store.gif') > -1);
  }

  function getIsAvailableForOnlineBuying(body)
  {
    return (body.indexOf('/wcsstore/argosie/en_IE/images/p1/icon_isaltmc_lorry.gif') > -1);
  }

  function getProductPrice(body){

    return body.match(/\"price\">\s*\&euro\;(.*?)\s/)[1];
  }

  function getPreviousPrice(body)
  {
    var match = body.match(/class=\"wasprice\">\s*.*\s*\&euro;(.*)\s/);
    return match === null ? 0 : match[1];
  }

  function getPageTitle(body){
    return body.match(/<title>([^`]*?)<\/title>/)[1];
  }

  function getProductImageUrl(body){
    var urlEnding = body.match(/id="mainimage" src="(.*?)"/)[1];
    return 'https://www.argos.ie' + urlEnding;
  }

  function getArrayOfHtmlForEachProduct (body)
  {
    var items = body.split('<li class="producttitle">');
    items = items.slice(1);

  	return items;
  }

  function getProductPriceFromListItem(htmlItem)
  {
    var match = htmlItem.match(/class="price footnote"\>\s*\&euro;(.*)\s*\<span/);
    if (match === null)
    {
      match = htmlItem.match(/class="price "\>\s*\&euro;(.*)\s*\<\/li/);
    }

    return match[1];
  }

  function getPreviousPriceFromListItem(htmlItem)
  {
    var match = htmlItem.match(/class="wasprice"\>Was\s\&euro;(.*)\s*\<\/li/);
    return match === null ? 0 : match[1];
  }

  function getProductNameFromListItem(htmlItem)
  {
    return htmlItem.match(/class="description"\>\s*\<a.*>(.*)\<\/a\>/)[1];
  }

  function getProductIdFromListItem(htmlItem)
  {
    var match = htmlItem.match(/class="partnum">(.*)<\/span\>/);
    return match[1];
  }

  function getProductImageUrlFromListItem(htmlItem){
    var urlEnding = htmlItem.match(/class=\"searchProductImgList\".*src\=\"([^\"]*)\"/)[1];
    return 'https://www.argos.ie' + urlEnding;
  }

  module.exports = exports;
})();
