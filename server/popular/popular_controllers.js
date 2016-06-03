(function () {
  'use strict';
  const request = require('request');
  const async = require('async');
  const ProductsUtil = require('../../lib/util/index').Products;
  const cache = require('memory-cache');
  const THIRTY_MINUTES = 1800000;

  if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

  module.exports = exports = {
    getPopular : getPopular,
    popularPage: popularPage
  };

  function popularPage(request, response, next) {
    var limit = 20;
    var offset = 0;
    var cachedProducts = cache.get(`popular${request.params.days}`);
    if (cache.get(`popular${request.params.days}`)) {
      displayPopularProductPage(request, response, cachedProducts);
    } else {
      getPopularProductsList(request.params.days, limit, offset, function (error, products) {
        if (error) {
          displayPopularProductPage(request, response, []);
        } else {
          cache.put(`popular${request.params.days}`, products, THIRTY_MINUTES);
          displayPopularProductPage(request, response, products);
        }
      });
    }
  }

  function displayPopularProductPage(request, response, products)
  {
    var params = request.params;
    var stores = require('../assets/stores.json');

    var renderParams = {
      title: 'Checkargos.com - An Irish Stock Checker',
      productListMessage : "Recent Popular Products",
      storeList: stores,
      searchQuery : params.q,
      inputs : params,
      productList: products,
      hasProducts: products.length > 0,
      partials : {
        common_head: 'common_head',
        common_scripts: 'common_scripts',
        navbar: 'navbar',
        content: 'product_list_result',
        advanced_search_filters: 'advanced_search_filters',
        catagories_drop_down: 'catagories_drop_down',
        product_list_table: 'product_list_table',
        store_drop_down: 'store_drop_down'
      }
    };

    response.render('common', renderParams);
  }

  function getPopularProductsList(days, limit, offset, callback)
  {
    var keen_io_url = KEEN_IO_PRODUCTS_URL.format(days);
    request(keen_io_url, function onResponse(error, response, body) {

      if(!error)
      {
        var productsIds = [];
        var responseJson = JSON.parse(body);
        console.log(JSON.stringify(body));
        productsIds = responseJson.result.map(function(obj){
          var newObj = {};

          newObj.productId = obj.productId;
          newObj.occurancies = obj.result.length;
          return newObj;
        });

        productsIds.sort(function(a,b){ return b.occurancies - a.occurancies; });

        ProductsUtil.getProductDetailsFromProductList(productsIds, limit, offset, callback);
      }
      else {
        callback(error, null);
      }

    });
  }

  function getProductDetailsFromProductList(productIds, limit, offset, callback)
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

  }

  function getPopular(req, res, next) {
    try{
      getPopularProducts(req, res, next);
    }
    catch(ex){
      console.error('Catch');
      console.error(ex);
      res.status(500).send('Error with request');
    }
  }

  var KEEN_IO_PRODUCTS_URL = "https://api.keen.io/3.0/projects/55f97c6590e4bd095c030e89/queries/select_unique?api_key=5d37952c0e6565119cafd26e7c0c6dfab710df97d3414d33c7d88e464c2aa24f5c52202bece7ee777f4cc0770c1e7e749efebc04fc310c8970a0e59a4659b6acf84382607dde8f30a035ae306f2c796b3f0947cc8d89dad5424366f92b9da120d1ec1d39f1ef91654dd768a42cbc1a33&event_collection=clicked.referral&target_property=keen.id&group_by=productId&timezone=UTC&timeframe=this_{0}_days&filters=%5B%5D";

  //old route
  function getPopularProducts(req, res, next) {
    var days = "2";
    if(req.query.days)
    {
      days = req.query.days;
    }
    var keen_io_url = KEEN_IO_PRODUCTS_URL.format(days);
    request(keen_io_url, function onResponse(error, response, body) {

      if(!error)
      {
        var productList = [];
        var responseJson = JSON.parse(body);
        productList = responseJson.result.map(function(obj){
          var newObj = {};

          newObj.productId = obj.productId;
          newObj.occurancies = obj.result.length;
          return newObj;
        });

        productList.sort(function(a,b){ return b.occurancies - a.occurancies; });

        getProductDetailsFromList(productList, res, req.query.limit, req.query.offset);
        //res.status(200).json(productList);
      }
      else {
        res.status(400);
      }

    });
  }
  function getProductDetailsFromList(productList, res, limit, offset)
  {
    if(!offset)
    {
      offset = 0;
    }

    if(limit)
    {
      console.log(offset + limit);
      var cutOff = parseInt(offset) + parseInt(limit);
      if(cutOff > productList.length)
      {
        cutOff = productList.length - parseInt(offset);
      }

      productList = productList.slice(offset, cutOff);
    }

    async.each(productList, ProductsUtil.getProductInformation, function done (err) {
      console.log("done");
      removeItemsThatNoLongerExist(productList);
      res.status(200).json(productList);
    });

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

})();
