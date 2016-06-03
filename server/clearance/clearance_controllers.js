module.exports = exports = {
  clearance : clearance,
  clearanceSearchPage : clearanceSearchPage
};

var search = require('../search/search_controllers.js');
var hoganHelper = require('../utils/hogan_helper.js');

function clearance(req, res, next) {

  var stores = require('../assets/stores.json');

  var catagories = require('../assets/catagories.json');

  res.render('common', {
    title: 'Checkargos.com - An Irish Stock Checker',
    storeList: stores,
    catagoryList: catagories,
    clearanceMessageText: "Clearance Search",
    elementToUpdate: "filterButton",
    advancedSearchFilter : {
      formAction : "/clearance/search",
      disableButton: true,
      buttonText: "Search"
    },
    partials : {
      common_head: 'common_head',
      common_scripts: 'common_scripts',
      navbar: 'navbar',
      content: 'clearance',
      advanced_search_filters: 'advanced_search_filters',
      catagories_drop_down: 'catagories_drop_down',
      store_drop_down: 'store_drop_down'
    }
  });
}

function clearanceSearchPage(req, res, next) {

  var catagoriesMap = require('../assets/catagories_map.json');
  var clearanceSectionMap = require('../assets/clearance_section_map.json');
  var params = req.query;
  params.sectionNumber = params.catagory;
  params.sectionText = catagoriesMap[params.sectionNumber];
  params.subSectionText = 'Clearance+' + params.sectionText;
  params.subSectionNumber = clearanceSectionMap[params.sectionNumber];

  search.textSearchMethod(params)
  .then(function textSearchResult(result){
    if(result && result.hasOwnProperty("items")) {
      displayClearanceResultPage(req, res, result.items);
    } else if (result && result.hasOwnProperty('productId')) {
        res.redirect('/product/'+result.productId);
    } else {
      displayClearanceResultPage(req, res, null);
    }
  })
  .catch(function textSearchFail(err) {
    displayClearanceResultPage(req, res, null);
  });
}

function displayClearanceResultPage(request, response, products)
{
  var params = request.query;
  var stores = require('../assets/stores.json');
  var catagories = require('../assets/catagories.json');

  var renderParams = {
    title: 'Checkargos.com - An Irish Stock Checker',
    inputs : params,
    productList: products,
    hasProducts: (products && products.length > 0),
    clearanceMessageText: "Clearance Search",
    elementToUpdate: "filterButton",
    partials : {
      common_head: 'common_head',
      common_scripts: 'common_scripts',
      navbar: 'navbar',
      content: 'clearance_result',
      advanced_search_filters: 'advanced_search_filters',
      catagories_drop_down: 'catagories_drop_down',
      product_list_table: 'product_list_table',
      store_drop_down: 'store_drop_down'
    }
  };

  renderParams = hoganHelper.populateRenderParamsWithAdvancedSearch(renderParams, params, "/clearance/search", false, "Search");

  response.render('common', renderParams);
}
