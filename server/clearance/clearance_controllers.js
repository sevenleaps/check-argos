function clearance(req, res, next) {

  var fs = require('fs');
  var stores = JSON.parse(fs.readFileSync('server/assets/stores.json', 'utf8'));

  var catagories = JSON.parse(fs.readFileSync('server/assets/catagories.json', 'utf8'));

  res.render('common', {
    title: 'Checkargos.com - An Irish Stock Checker',
    storeList: stores,
    catagoryList: catagories,
    clearanceMessageText: "Clearance Search",
    advancedSearchFilterFormAction: "/clearance/search",
    advancedSearchDisableButton: true,
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

module.exports = exports = {
  clearance : clearance
};
