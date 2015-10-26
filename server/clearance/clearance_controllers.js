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

  var callbackParams = {
    response : res,
    params : params
  }
  search.textSearchMethod(params, clearanceSearchResult, callbackParams);
}

function clearanceSearchResult(error, result, callbackParams)
{
  if(error)
  {
    displayClearanceResultPage(null, callbackParams);
  }
  else
  {
    if(result)
    {
      if(result.hasOwnProperty("items"))
      {
        displayClearanceResultPage(result.items, callbackParams);
      }
      else {
        //Show Product Page
      }
    }
    else {
      displayClearanceResultPage(null, callbackParams);
    }
  }
}

function displayClearanceResultPage(items, callbackParams)
{
  var params = callbackParams.params;
  var response = callbackParams.response;
  var stores = require('../assets/stores.json');
  var catagories = require('../assets/catagories.json');

  //console.log(response);

  response.render('common', {
    title: 'Checkargos.com - An Irish Stock Checker',
    storeList: stores,
    catagoryList: catagories,
    selectedCatagory: function() {
             if (this.code==params.sectionNumber) return "selected";
             return "";
        },
    selectedStore: function() {
                 if (this.code==params.store) return "selected";
                 return "";
            },
    inputs : params,
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
