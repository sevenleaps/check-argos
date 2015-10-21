function clearance(req, res, next) {

  var fs = require('fs');
  var stores = JSON.parse(fs.readFileSync('server/assets/stores.json', 'utf8'));
  console.log(stores);

  res.render('common', {
    title: 'Checkargos.com - An Irish Stock Checker',
    storeList: stores,
    clearanceMessageText: "Popular Products",
    partials : {
      common_head: 'common_head',
      navbar: 'navbar',
      content: 'clearance'}
  });
}

module.exports = exports = {
  clearance : clearance
};
