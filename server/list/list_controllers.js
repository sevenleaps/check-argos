(function () {
  'use strict';
  var request = require('request');
  var async = require('async');
  var ProductsUtil = require('../../lib/util/index').Products;

  module.exports = exports = {
    customProductList : customProductList,
    createList : createList
  };

  function createList(request, response, next)
  {
    var renderParams = {
      title: 'Checkargos.com - An Irish Stock Checker',
      partials : {
        common_head: 'common_head',
        navbar: 'navbar',
        content: 'list_creator'
      }
    };

    response.render('common', renderParams);
  }

  function customProductList(request, response, next) {
    var limit = 50;
    var offset = 0;
    var productIds = request.params.productIds.split(',');
    var productList = productIds.map(function(productId){
      var obj = {};
      obj.productId = productId;
      return obj;
    });
    ProductsUtil.getProductDetailsFromProductList(productList, limit, offset, function (error, products) {
      if (error) {
        displayProductListPage(request, response, []);
      } else {
        displayProductListPage(request, response, products);
      }
    });
  }

  function displayProductListPage(request, response, products)
  {
    var params = request.params;
    var stores = require('../assets/stores.json');

    var renderParams = {
      title: 'Checkargos.com - An Irish Stock Checker',
      productListMessage : "Custom Product List",
      storeList: stores,
      searchQuery : params.q,
      inputs : params,
      productList: products,
      hasProducts: products.length > 0,
      partials : {
        common_head: 'common_head',
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

})();
