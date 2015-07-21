(function () {
  'use strict';
  var request = require('request');
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
    //console.log(body);
    return isValidProductPage;
  };

  exports.getTotalNumberOfProducts = function (body) {

    var items = body.split('<li class="producttitle">');
    var numProducts;

    try{
      numProducts = items[0].match('/of\s\<span\>([0-9]*)<\/span\>/')[1];
    }
    catch (ex){
      numProducts = 'Error';
    }

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

  exports.getProductPageHtml = function (productId, callback){

    var productUrl = 'http://www.argos.ie/static/Product/partNumber/' + productId +'.htm';

    console.log(productUrl);
    request(productUrl, callback);
  };

  exports.isValidProductPage = function (body){
    return body.indexOf('Sorry, we are unable to find the catalogue number(s) highlighted in your list.') <= -1;
  };

  exports.getProductInformationFromProductPage = function (body) {

    return {
      productId: getProductId(body),
      productName: getProductName(body),
      price: getProductPrice(body),
      previousPrice: getPreviousPrice(body),
      productImageUrl: getProductImageUrl(body)

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

  function getItemObject(htmlItem)
  {
    return {
      productId: getProductIdFromListItem(htmlItem),
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

    return productId;
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
    return 'http://www.argos.ie' + urlEnding;
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
    return 'http://www.argos.ie' + urlEnding;
  }

  module.exports = exports;
})();
