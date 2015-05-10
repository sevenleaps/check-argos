(function () {
  'use strict';
  var request = require('request')
  exports.getProductsFromHtml =  function (body) {

    var items = getArrayOfHtmlForEachProduct(body);

    var itemsList = [];
    items.forEach (function (entry){
      itemsList.push(getItemObject(entry));
    });

    return itemsList;
  }

  exports.isListOfProductsPage = function (body) {
    var items = body.split('<li class="producttitle">');
    var isValidProductPage = (items !== null && items.length > 1);
    return isValidProductPage;
  }

  exports.getTotalNumberOfProducts = function (body) {

    var items = body.split('<li class="producttitle">');
  	return items[0].match('/of\s\<span\>([0-9]*)<\/span\>/')[1];
  }

  exports.isFoundNoProductsPage = function (body) {

    return (body.indexOf('Sorry we didn\'t find an exact match.') > -1)
      || (body.indexOf('Sorry we didn\'t find any results.') > -1);
  }

  exports.cleanUpProductId = function(productId) {

    return cleanUpProductId(productId);
  }

  function cleanUpProductId(productId) {

    productId = productId.replace(/ /g, '');
    productId = productId.replace(/\//g, '');

    return productId;
  }

  exports.isValidProductId = function (productId) {

    productId = cleanUpProductId(productId);

    var hasMatch = productId.match(/\d{7}/) !== null;
    return hasMatch;
  }

  exports.getProductPageHtml = function (productId, callback){

    var productUrl = "http://www.argos.ie/static/Product/partNumber/" + productId +".htm";

    console.log(productUrl);
    request(productUrl, callback);
  }

  exports.isValidProductPage = function (body){
    return body.indexOf('Sorry, we are unable to find the catalogue number(s) highlighted in your list.') <= -1;
  }

  exports.getProductInformationFromProductPage = function (body) {

    return {
      productId: getProductId(body),
      productName: getProductName(body),
      price: getProductPrice(body),
      previousPrice: getPreviousPrice(body),
      productImageUrl: getProductImageUrl(body)

    };
  }

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
    var match = body.match(/class="partnumber">(.*)<\/span\>/);
    return match[1];
  }

  function getProductName(body){
    var pageTitle = getPageTitle(body);
    var productName = pageTitle.split("at Argos.ie")[0];
    productName = productName.replace(/Buy /g, '');
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
    return "http://www.argos.ie" + urlEnding;
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
    return "http://www.argos.ie" + urlEnding;
  }

  module.exports = exports
})();
