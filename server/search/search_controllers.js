(function () {
  'use strict';
  var request = require('request');
  var rp = require('request-promise');
  var moment = require('moment');
  var Promise = require('bluebird');

  var ArgosResponseError = require('../../lib/error-handling/lib/').ArgosResponseError;
  var ProductsUtil = require('../../lib/util/index').Products;
  var hoganHelper = require('../utils/hogan_helper.js');

  module.exports = exports = {
    textSearch : textSearch,
    search : search,
    searchPage : searchPage,
    textSearchMethod : textSearchMethod,
    searchInternal: searchInternal
  };

  var customHeaderRequest = request.defaults({
    headers: {
      'User-Agent': "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0",
      "Connection": "keep-alive",
      "Accept": "*/*"
    }
  })

  function searchPage(req, res, next) {

    var catagoriesMap = require('../assets/catagories_map.json');
    var params = req.query;
    params.sectionNumber = req.query.catagory;
    params.sectionText = catagoriesMap[params.sectionNumber];
    params.searchString = params.q;

    var isProductId = ProductsUtil.isValidProductId(params.searchString);
    if(isProductId){
      res.redirect('/product/' + ProductsUtil.cleanUpProductId(params.searchString));
    }
    else {
      var callbackParams = {
        request : req,
        response : res,
        params : params
      };
      textSearchMethod(params)
      .then(function textSearchResult(result){
        //Check if its a list of products
        if(result && result.hasOwnProperty('items')) {
          result.items.forEach(function eachResult(item){
            item.percentageSaving = calculatePrecentageSaving(item.price, item.previousPrice);
          });
          displaySearchResultPage(result.items, callbackParams);
        }
        else if (result && result.hasOwnProperty('productId')){
          res.redirect('/product/'+result.productId);
        } else {
          displaySearchResultPage(null, callbackParams);
        }
      })
      .catch(function textSearchFail(err){
        console.log(err);
        displaySearchResultPage(null, callbackParams);
      });
    }
  }

  function calculatePrecentageSaving(price, previousPrice){
    var percentageSaving = 0;
    if(previousPrice !== 0 && price !== '.')
    {
      percentageSaving = ((1 - (price / previousPrice))* 100).toFixed(0);
    }
    return percentageSaving;
  }

  function displaySearchResultPage(items, callbackParams)
  {
    var params = callbackParams.params;
    var response = callbackParams.response;

    var renderParams = {
      title: 'Checkargos.com - An Irish Stock Checker',
      searchQuery : params.q,
      inputs : params,
      productList: items,
      hasProducts: (items && items.length > 0),
      partials : {
        common_head: 'common_head',
        common_scripts: 'common_scripts',
        navbar: 'navbar',
        content: 'search_result',
        advanced_search_filters: 'advanced_search_filters',
        catagories_drop_down: 'catagories_drop_down',
        product_list_table: 'product_list_table',
        store_drop_down: 'store_drop_down'
      }
    };

    renderParams = hoganHelper.populateRenderParamsWithAdvancedSearch(renderParams, params, '/search', false, 'Update');

    response.render('common', renderParams);
  }

  function searchInternal(productId, callback) {
    if (ProductsUtil.isValidProductId(productId)) {
      var productNum = ProductsUtil.cleanUpProductId(productId);
      ProductsUtil.getProductPageHtml(productNum, function onResponse(error, response, body) {
        var productPageHtml = body;
        if (ProductsUtil.isValidProductPage(productPageHtml)) {
          var product = ProductsUtil.getProductInformationFromProductPage(productPageHtml);
          return callback(null, product);
        }
        else {
          return callback('Not a product id');
        }
      });
    }
  }



  function search(req, res, next) {
    try {
      if (req.query && (req.query.q || req.query.isClearance))
      {
        if (ProductsUtil.isValidProductId(req.query.q)) {
          searchProductNumber(req, res, next);
        } else {
          //should we check was this an effort at a productId?
          req.query.searchString = req.query.q;
          textSearch(req, res, next);
        }
      } else {
        res.status(200).json([]);
      }
    }
    catch(ex){
      console.error(ex);
      res.status(500).send('Error with request');
    }
  }

  function searchProductNumber(req, res) {
    var productNum = ProductsUtil.cleanUpProductId(req.query.q);
    var product = {
      productId: productNum
    };

    ProductsUtil.getProductInformation(product, function productInformation(){
      if(product.price){
        res.status(200).json(product);
      } else {
        res.status(404).json({});
      }
    });
  }


function textSearchMethod(params)
{
  return new Promise(function search(resolve, reject) {

    var url;
    if(params.subSectionText || params.subSectionNumber){
      url = buildSubCatagorySearchUrl(params);
    } else {
      url = buildSearchUrl(params);
    }

    console.log(url)
    customHeaderRequest(url, function onResponse(err, response, body) {
      if (err) {
        reject(err);
      } else {
        var totalNumProducts = ProductsUtil.getTotalNumberOfProducts(body);
        if (ProductsUtil.isListOfProductsPage(body) && (totalNumProducts !== 'Error')) {
          try {
            var productsJson = ProductsUtil.getProductsFromHtml(body);

            productsJson = productsJson.filter(function filterBadProducts(item){
              return item.price !== '.';
            });

            var returnObj = {
              items: productsJson,
              totalNumProducts: totalNumProducts
            };

            resolve(returnObj);

          } catch (err) {
             reject(err);
          }
        } else if (ProductsUtil.isSpecialCatagotyPage(response.request.path) && !(params.subSectionText || params.subSectionNumber)){
          try {
            console.log('Is a sub catagory page');
            var catagoryInfo = ProductsUtil.getCatagoryInformationFromPath(response.request.path);

            params.sectionText = catagoryInfo.catagoryName;
            params.sectionNumber = catagoryInfo.catagoryNumber;
            params.subSectionText = catagoryInfo.subCatagoryName;
            params.subSectionNumber = catagoryInfo.subCatagoryNumber;

            // Need to append catagory details and do the search again
            textSearchMethod(params)
            .then(resolve, reject);

          }
          catch (err) {
            reject(err);
          }
        }
        else if(!ProductsUtil.isFoundNoProductsPage(body)) {
          try{
            var productInfoJson = ProductsUtil.getProductInformationFromProductPage(body);
            resolve(productInfoJson);
          }
          catch (err) {
            reject(err);
          }
        }
        else {
          resolve(null);
        }
      }
    });

  });
}

  function textSearch(req, res, next) {
    try{
      if(!validateParams(req.query)) {
        res.status(400);
      }
      else {

        var url;
        if(req.query.isClearance === 'true')
        {
          if(req.query.sectionText && req.query.sectionNumber)
          {
            req.query.subSectionText = 'Clearance+' + req.query.sectionText;
            req.query.subSectionNumber = clearanceMap[req.query.sectionNumber];
          }
        }

        if(req.query.subSectionText || req.query.subSectionNumber)
        {
          url = buildSubCatagorySearchUrl(req.query);
        }
        else
        {
          url = buildSearchUrl(req.query);
        }

        console.log('Generated URL for Argos' + url);
        customHeaderRequest(url, function onResponse(error, response, body) {
          if (error) {
            return next(new ArgosResponseError(error));
          }

          var totalNumProducts = ProductsUtil.getTotalNumberOfProducts(body);
          if (ProductsUtil.isListOfProductsPage(body) && (totalNumProducts !== 'Error')) {
            try {
              var productsJson = ProductsUtil.getProductsFromHtml(body);

              var returnObj = {
                items: productsJson,
                totalNumProducts: totalNumProducts
              };
              res.status(200).json(returnObj);
             } catch (error) {
               return next(new ArgosResponseError(error));
             }
          }
          else if(ProductsUtil.isSpecialCatagotyPage(response.request.path) && !(req.query.subSectionText || req.query.subSectionNumber)){
            try{
              console.log('Is a sub catagory page');
              var catagoryInfo = ProductsUtil.getCatagoryInformationFromPath(response.request.path);

              req.query.sectionText = catagoryInfo.catagoryName;
              req.query.sectionNumber = catagoryInfo.catagoryNumber;
              req.query.subSectionText = catagoryInfo.subCatagoryName;
              req.query.subSectionNumber = catagoryInfo.subCatagoryNumber;

              textSearch(req, res, next);

            }
            catch (error) {
              return next(new ArgosResponseError(error));
            }
          }
          else if(!ProductsUtil.isFoundNoProductsPage(body)) {
            try{
              var productInfoJson = ProductsUtil.getProductInformationFromProductPage(body);
              res.status(200).json(productInfoJson);
            }
            catch (error) {
              return next(new ArgosResponseError(error));
            }
          }
          else {
            res.status(200).json(generateError('No Results'));
          }
        });

      }
    }
    catch(ex){
      console.error(ex);
      res.status(500).send('Error with request');
    }

  }

  function generateError(errorMessage) {
    return {
      error: errorMessage
    };
  }

  function validateParams(params) {
    if (params.searchString === undefined)
    {
      return false;
    }

    return true;
  }

  var productsPerPage = 40;
// http://www.argos.ie/static/Browse/c_1/1|category_root|Video games|14419738/c_2/2|14419738|Clearance+Video games|14419738/p/1/pp/80/r_001=2|Price|0+%3C%3D++%3C%3D+1000000|2/s/Price%3A+Low+-+High.htm
// http://www.argos.ie/static/Browse/c_1/1|category_root|".$sectionSelected.|".$sectionNumber[$sectionSelected]."/c_2/2|".$sectionNumber[$sectionSelected]."|Clearance+".$sectionSelected."|".$clearanceNumber[$sectionSelected]."/p/".$countProduct."/pp/".$productsPerPage."/r_001/4|Price|".$minPrice."+%3C%3D++%3C%3D+".$maxPrice."|2/s/".$searchPreference.".htm");
function buildSubCatagorySearchUrl(params) {
    var baseUrl = 'https://www.argos.ie/static/Browse/c_1/1%7Ccategory_root%7C';
    var url = baseUrl;
    var searchPreference = 'Price%3A+Low+-+High';
    url = url + params.sectionText + '|' + params.sectionNumber + '/c_2/2|' + params.sectionNumber  + '|' + params.subSectionText + '|' + params.subSectionNumber;

    var p = (params.productOffset) ? params.productOffset : 1;
    var pp = (params.productsPerPage) ? params.productsPerPage : productsPerPage;
    url = url + '/p/'+ p;
    url = url + '/pp/' + pp;

    var minPrice = !params.minPrice ? 0 : params.minPrice;
    var maxPrice = !params.maxPrice ? 1000000 : params.maxPrice;

    url = url + '/r_001/4|Price|' + minPrice + '+%3C%3D++%3C%3D+' + maxPrice + '|2';
    url = url + '/s/' + searchPreference + '.htm';

    console.log('clearance ' + url);
    return url.replace(/ /g, '+');
  }

  function buildSearchUrl(params) {
    var baseUrl = 'https://www.argos.ie/webapp/wcs/stores/servlet/Search';
    var url = baseUrl;

    //Adding required static params
    url = url + '?storeId=10152&langId=111';
    //Adding optional search parameters
    url = (params.searchString) ? url + '&q=' + params.searchString : url;
    var pp = (params.productsPerPage) ? params.productsPerPage : productsPerPage;
    url = url + '&pp=' + pp;
    url = (params.productOffset) ? url + '&p=' + params.productOffset : url;
    url = (params.sortType) ? url + '&s=' + params.sortType : url;
    url = (params.sectionText && params.sectionNumber) ? url + '&c_1=1|category_root|' + params.sectionText + '|' + params.sectionNumber : url;

    var minPrice = !params.minPrice ? 0 : params.minPrice;
    var maxPrice = !params.maxPrice ? 1000000 : params.maxPrice;

    url = url + '&r_001=2|Price|' + minPrice + '+%3C%3D++%3C%3D+' + maxPrice + '|2';
    //console.log(url);

    return url.replace(/ /g, '+');

  }

  var clearanceMap = {
    '14418476' : '14520894', // Kitchen+and+laundry
    '14417894' : '14520317', // Home+and+furniture
    '14418702' : '14519703', // Garden+and+DIY
    '14419152' : '14520980', // Sports+and+leisure
    '14418350' : '14520139', // Health+and+personal+care
    '14419512' : '14520847', // Home+entertainment+and+sat+nav
    '14419738' : '14521085', // Video+games
    '14419436' : '14520956', // Photography
    '14418968' : '14520934', // Office%2C+PCs+and+phones
    '14417629' : '14521005', // Toys+and+games
    '14417537' : '14520914', // Nursery
    '14416987' : '14520873', // Jewellery+and+watches
    '14417351' : '14519943'  // Gifts
  };


})();
