var moment = require('moment');
var searchController = require('../search/search_controllers.js');
var stockController = require('../stock/stock_controllers.js');
var stores = require('../assets/stores.json');
var REFERRAL_LINK= 'http://www.argos.ie/static/Product/partNumber/';
var CJ_ID = '7708057';


function product(req, res){
  searchController.searchInternal(req.params.productId, function (error, product){
    if (error) {
      return displayErrorPage(res, error, req.params.productId)
    } else {
      //Add todays price
      prices = []
      prices.push({
        id: product.productId,
        price: product.price * 100,
        timestamp: new Date().getTime(),
      });

      console.log(prices)
      var productModel = { product: product};
      var row = 0;
      productModel.additionalHeadRows = ['<script type="text/javascript" src="assets/stores.json"></script>'];
      productModel.product.productId = req.params.productId;
      productModel.stores = stores;
      productModel.tableRowStart = function isEven(){
        row++;
        return row % 2 === 1 ? '<tr>' : '';
      };
      productModel.tableRowEnd = function isEven(){
        return row % 2 === 0 ? '</tr>' : '';
      };
      var cleansedProductId = productModel.product.productId.replace('/', '')
      productModel.referral = REFERRAL_LINK + cleansedProductId + ".htm";
      productModel.title = 'Checkargos.com - An Irish Stock Checker';
      productModel.chartJSON = JSON.stringify(prices);
      productModel.jsonProduct = JSON.stringify(product);
      productModel.searchQuery = product.productId;
      productModel.partials = {
        common_head: 'common_head',
        common_scripts: 'common_scripts',
        navbar: 'navbar',
        content: 'product_page',
        product_info: 'product_info',
        product_store_info: 'product_store_info',
        product_store_info_small: 'product_store_info_small',
        product_store_table: 'product_store_table',
        store_drop_down: 'store_drop_down'
      };
      return res.render('common', productModel);
    }
  });
}

function displayErrorPage(res, error, productId) {
  return res.render('common', {
    message : error,
    searchQuery : productId,
    partials: {
      common_head: 'common_head',
      common_scripts: 'common_scripts',
      navbar: 'navbar',
      content: 'error'
    }
  });
}

module.exports = exports = {
  product : product
};
