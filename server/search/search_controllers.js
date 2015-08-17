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
      if (req.query && (req.query.q || req.query.isClearance))
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
        request(url, function onResponse(error, response, body) {
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
    var baseUrl = 'http://www.argos.ie/static/Browse/c_1/1%7Ccategory_root%7C';
    var url = baseUrl;
    var searchPreference = 'Price%3A+Low+-+High';
    url = url + params.sectionText + '|' + params.sectionNumber + '/c_2/2|' + params.sectionNumber  + '|' + params.subSectionText + '|' + params.subSectionNumber;

    var p = (params.productOffset) ? params.productOffset : 1;
    var pp = (params.productsPerPage) ? params.productsPerPage : productsPerPage;
    url = url + '/p/'+ p;
    url = url + '/pp/' + pp;

    params.minPrice = params.minPrice === undefined ? 0 : params.minPrice;
    params.maxPrice = params.maxPrice === undefined ? 1000000 : params.maxPrice;

    url = url + '/r_001/4|Price|' + params.minPrice + '+%3C%3D++%3C%3D+' + params.maxPrice + '|2';
    url = url + '/s/' + searchPreference + '.htm';

    console.log('clearance ' + url);
    return url.replace(/ /g, '+');
  }

  function buildSearchUrl(params) {
    var baseUrl = 'http://www.argos.ie/webapp/wcs/stores/servlet/Search';
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

    params.minPrice = params.minPrice === undefined ? 0 : params.minPrice;
    params.maxPrice = params.maxPrice === undefined ? 1000000 : params.maxPrice;

    url = url + '&r_001=2|Price|' + params.minPrice + '+%3C%3D++%3C%3D+' + params.maxPrice + '|2';

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
