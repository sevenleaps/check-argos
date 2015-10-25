var search = require('../search/search_controllers.js');

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
      disableButton: false,
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

function clearanceSearchPage(req, res, next) {

  var catagoriesMap = require('../assets/catagories_map.json');
  var clearanceSectionMap = require('../assets/clearance_section_map.json');
  var params = req.query;
  params.sectionNumber = req.query.catagory
  params.sectionText = catagoriesMap[params.sectionNumber];
  params.subSectionText = 'Clearance+' + params.sectionText;
  params.subSectionNumber = clearanceSectionMap[params.sectionNumber];

  search.textSearchMethod(params, clearanceSearchResult, res);
}

function clearanceSearchResult(error, result, response)
{
  if(error)
  {
    displayClearanceResultPage(null, response);
  }
  else
  {
    if(result)
    {
      if(result.hasOwnProperty("items"))
      {
        displayClearanceResultPage(result.items, response);
      }
      else {
        //Show Product Page
      }
    }
    else {
      displayClearanceResultPage(null, response);
    }
  }
}

function displayClearanceResultPage(items, response)
{
  var stores = require('../assets/stores.json');

  var catagories = require('../assets/catagories.json');

  //console.log(response);

  response.render('common', {
    title: 'Checkargos.com - An Irish Stock Checker',
    storeList: stores,
    catagoryList: catagories,
    productList: items,
    hasProducts: (items && items.length > 0),
    clearanceMessageText: "Clearance Search",
    advancedSearchFilter : {
      formAction : "/clearance/search",
      disableButton: false,
      buttonText: "Search"
    },
    partials : {
      common_head: 'common_head',
      navbar: 'navbar',
      content: 'clearance_result',
      advanced_search_filters: 'advanced_search_filters',
      catagories_drop_down: 'catagories_drop_down',
      store_drop_down: 'store_drop_down'
    }
  });
}

module.exports = exports = {
  clearance : clearance,
  clearanceSearchPage : clearanceSearchPage
};
