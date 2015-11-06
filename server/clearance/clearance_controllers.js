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
    advancedSearchFilter : {
      formAction : "/clearance/search",
      disableButton: true,
      buttonText: "Search"
    },
    partials : {
      common_head: 'common_head',
      navbar: 'navbar',
      content: 'clearance',
      advanced_search_filters: 'advanced_search_filters',
      catagories_drop_down: 'catagories_drop_down',
      store_drop_down: 'store_drop_down'
    }
  });
}

function clearanceSearchPage(request, response, next) {

  var catagoriesMap = require('../assets/catagories_map.json');
  var clearanceSectionMap = require('../assets/clearance_section_map.json');
  var params = request.query;
  params.sectionNumber = request.query.catagory;
  params.sectionText = catagoriesMap[params.sectionNumber];
  params.subSectionText = 'Clearance+' + params.sectionText;
  params.subSectionNumber = clearanceSectionMap[params.sectionNumber];

  search.textSearchMethod(params, function(error, result){
    if(error || !result){
      displayClearanceResultPage(request, response, null);
    }
    else{
      if(result){
        if(result.hasOwnProperty("items")){
          displayClearanceResultPage(request, response, result.items);
        }
        else {
          //Show Product Page
        }
      }
    }
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
    partials : {
      common_head: 'common_head',
      navbar: 'navbar',
      content: 'clearance_result',
      advanced_search_filters: 'advanced_search_filters',
      catagories_drop_down: 'catagories_drop_down',
      store_drop_down: 'store_drop_down'
    }
  };

  renderParams = hoganHelper.populateRenderParamsWithAdvancedSearch(renderParams, params, "/clearance/search", false, "Search");

  response.render('common', renderParams);
}
