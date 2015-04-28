(function () {
  'use strict';
  var request = require('request')
  var ProductsUtil = require('../../lib/util/index').Products

  module.exports = exports = {
    textSearch : textSearch,
    search : search
  };

  function search(req, res, next) {
    if(req.query && req.query.q)
    {
      if(ProductsUtil.isValidProductId(req.query.q))
      {
        searchProductNumber(req, res, next);
      }
      else
      {
        //should we check was this an effort at a productId?
        req.query.searchString = req.query.q;
        textSearch(req, res, next);

      }
    }
  }

  function searchProductNumber(req, res, next){
    var productNum = ProductsUtil.cleanUpProductId(req.query.q);
    ProductsUtil.getProductPageHtml(productNum, function onResponse(error, response, body)
    {
      var productPageHtml = body;
      //console.log(productPageHtml);
      if(ProductsUtil.isValidProductPage(productPageHtml))
      {
        var productInfoJson = ProductsUtil.getProductInformationFromProductPage(productPageHtml);
        res.status(200).json(productInfoJson);
      }
      else
      {
        //invalid product page
      }
    });

  }

  function textSearch(req, res, next) {

    if(!validateParams(req.query))
    {
      res.status(400);
    }
    else
    {
      var url = buildSearchUrl(req.query);

      request(url, function onResponse(error, response, body)
      {
        var productsJson = ProductsUtil.getProductsFromHtml(body);
        res.status(200).json(productsJson);
      });

    }

  }

  function validateParams(params)
  {
    if(params.searchString === undefined)
    {
      return false;
    }

    return true;
  }

  function buildSearchUrl(params) {
    var baseUrl = "http://www.argos.ie/webapp/wcs/stores/servlet/Search";
    var url = baseUrl;

    //Adding required static params
    url = url + "?storeId=10152&langId=111";

    if(params.searchString)
    {
      url = url + "&q=" + params.searchString;
    }

    if(params.numberOfItems)
    {
      url = url + "&pp=" + params.numberOfItems;
    }

    if(params.sortType)
    {
      url = url + "&s=" + params.sortType;
    }

    if(params.sectionText && params.sectionNumber)
    {
      url = url + "&c_1=1|category_root|" + params.sectionText + "|" + params.sectionNumber;
    }

    if(params.minPrice || params.maxPrice)
    {
      params.minPrice = params.minPrice === undefined ? 0 : params.minPrice;
      params.maxPrice = params.maxPrice === undefined ? 1000000 : params.maxPrice;

      url = url + "&r_001=2|Price|" + params.minPrice + "+%3C%3D++%3C%3D+" + params.maxPrice + "|2";
    }

    return url;

  }

})();
