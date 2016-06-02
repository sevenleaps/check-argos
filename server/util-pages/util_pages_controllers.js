var stores = require('../assets/stores.json');

function addAllStores(req, res, next) {
  res.render('common', {
    title: 'Checkargos.com - An Irish Stock Checker',
    stores: stores,
    partials : {
      common_head: 'common_head',
      common_scripts: 'common_scripts',
      navbar: 'navbar',
      content: 'store_add_all'}
  });
}

module.exports = exports = {
  addAllStores : addAllStores
};
