(function () {
  'use strict';
  exports.getProductsFromHtml =  function (body) {

    var items = getArrayOfHtmlForEachProduct(body);

    var itemsList = [];
    items.forEach (function (entry){
      itemsList.push(getItemObject(entry));
    });

    return itemsList;
  }

  exports.getTotalNumberOfProducts = function (body) {

    var items = body.split('<li class="producttitle">');
  	return items[0].match('/of\s\<span\>([0-9]*)<\/span\>/')[1];
  }

  function getArrayOfHtmlForEachProduct (body)
  {
    var items = body.split('<li class="producttitle">');
    items = items.slice(1);

  	return items;
  }

  function getItemObject(htmlItem)
  {
    return {
      productId: getProductId(htmlItem),
      productName: getProductName(htmlItem),
      price: getProductPrice(htmlItem),
      previousPrice: getPreviousPrice(htmlItem)

    };
  }

  function getProductPrice(htmlItem)
  {
    var match = htmlItem.match(/class="price footnote"\>\s*\&euro;(.*)\s*\<span/);
    if (match === null)
    {
      match = htmlItem.match(/class="price "\>\s*\&euro;(.*)\s*\<\/li/);
    }

    return match[1];
  }

  function getPreviousPrice(htmlItem)
  {
    var match = htmlItem.match(/class="wasprice"\>Was\s\&euro;(.*)\s*\<\/li/);
    return match === null ? 0 : match[1];
  }

  function getProductName(htmlItem)
  {
    return htmlItem.match(/class="description"\>\s*\<a.*>(.*)\<\/a\>/)[1];
  }

  function getProductId(htmlItem)
  {
    var match = htmlItem.match(/class="partnum">(.*)<\/span\>/);
    return match[1];
  }

  module.exports = exports
})();
