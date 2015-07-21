(function () {
  'use strict';
  var request = require('request');
  var ArgosResponseError = require('../../lib/error-handling/lib/').ArgosResponseError;
  var ProductsUtil = require('../../lib/util/index').Products;

  module.exports = exports = {
    textSearch : textSearch,
    search : search
  };

  function search(req, res, next) {
    try {
      if (req.query && req.query.q)
      {
        if(ProductsUtil.isValidProductId(req.query.q)) {
          searchProductNumber(req, res, next);
        }
        else {
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

  function searchProductNumber(req, res, next) {
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
        res.status(404).json({});
      }
    });

  }

  function textSearch(req, res, next) {
    try{
      if(!validateParams(req.query)) {
        res.status(400);
      }
      else {
        var url = req.query.isClearance === 'true' ? buildClearanceUrl(req.query) : buildSearchUrl(req.query);

        request(url, function onResponse(error, response, body) {
          if (error) {
            return next(new ArgosResponseError(error));
          }

          if (ProductsUtil.isListOfProductsPage(body)) {
            try {
              var productsJson = ProductsUtil.getProductsFromHtml(body);
              res.status(200).json(productsJson);
             } catch (error) {
               return next(new ArgosResponseError(error));
             }
          }
          else if(!ProductsUtil.isFoundNoProductsPage(body)) {
            var productInfoJson = ProductsUtil.getProductInformationFromProductPage(body);
            res.status(200).json(productInfoJson);
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
// http://www.argos.ie/static/Browse/c_1/1|category_root|Video games|14419738/c_2/2|14419738|Clearance+Video games|14419738/p/1/pp/80/r_001=2|Price|0+%3C%3D++%3C%3D+1000000|2/s/Price%3A+Low+-+High.htm
// http://www.argos.ie/static/Browse/c_1/1|category_root|".$sectionSelected.|".$sectionNumber[$sectionSelected]."/c_2/2|".$sectionNumber[$sectionSelected]."|Clearance+".$sectionSelected."|".$clearanceNumber[$sectionSelected]."/p/".$countProduct."/pp/".$productsPerPage."/r_001/4|Price|".$minPrice."+%3C%3D++%3C%3D+".$maxPrice."|2/s/".$searchPreference.".htm");
  function buildClearanceUrl(params) {
    var baseUrl = 'http://www.argos.ie/static/Browse/c_1/1|category_root|';
    var url = baseUrl;
    var productsPerPage = 80;
    var searchPreference = 'Price%3A+Low+-+High';
    url = (params.sectionText && params.sectionNumber) ? url + params.sectionText + '|' + params.sectionNumber + '/c_2/2|' + params.sectionNumber  + '|Clearance+' + params.sectionText + '|' + params.sectionNumber : url;

    url = url + '/p/1';
    url = (params.numberOfItems) ? url + '/pp/' + params.numberOfItems : url + '/pp/' + productsPerPage;

    params.minPrice = params.minPrice === undefined ? 0 : params.minPrice;
    params.maxPrice = params.maxPrice === undefined ? 1000000 : params.maxPrice;

    url = url + '/r_001=2|Price|' + params.minPrice + '+%3C%3D++%3C%3D+' + params.maxPrice + '|2';
    url = url + '/s/' + searchPreference + '.htm';
    return url;
  }

  function buildSearchUrl(params) {
    var baseUrl = 'http://www.argos.ie/webapp/wcs/stores/servlet/Search';
    var url = baseUrl;

    //Adding required static params
    url = url + '?storeId=10152&langId=111';
    //Adding optional search parameters
    url = (params.searchString) ? url + '&q=' + params.searchString : url;
    url = (params.numberOfItems) ? url + '&pp=' + params.numberOfItems : url;
    url = (params.sortType) ? url + '&s=' + params.sortType : url;
    url = (params.sectionText && params.sectionNumber) ? url + '&c_1=1|category_root|' + params.sectionText + '|' + params.sectionNumber : url;

    params.minPrice = params.minPrice === undefined ? 0 : params.minPrice;
    params.maxPrice = params.maxPrice === undefined ? 1000000 : params.maxPrice;

    url = url + '&r_001=2|Price|' + params.minPrice + '+%3C%3D++%3C%3D+' + params.maxPrice + '|2';

    console.log('BLAG ' + url);
    return url;

  }

})();
