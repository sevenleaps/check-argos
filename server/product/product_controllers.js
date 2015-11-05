var request = require('request');
var moment = require('moment');
var stockController = require('../stock/stock_controllers.js');
var stores = require('../assets/stores.json');
var REFFERL_LINK= 'http://www.qksrv.net/links/7708057/type/am/http://www.argos.ie/static/Product/partNumber/';

function product(req, res){
  stockController.getPriceHistoryInternal(req, function onPrices(error, prices) {
    if (error) {
      return res.render('error', error);
    }
    request('http://www.checkargos.com/search/simple?q=' + req.params.productId, function (error, response, productString){
      var productModel = { product: JSON.parse(productString)};
      var row = 0;
      productModel.product.productId = req.params.productId;
      productModel.prices = convertPricesToHighAndLow(prices);
      productModel.stores = stores;
      productModel.tableRowStart = function isEven(){
        row++;
        return row % 2 === 1 ? '<tr>' : '';
      };
      productModel.tableRowEnd = function isEven(){
        return row % 2 === 0 ? '</tr>' : '';
      };
      productModel.referl = REFFERL_LINK + productModel.product.productId.replace('/', '') + '.htm';
      productModel.title = 'Checkargos.com - An Irish Stock Checker';
      productModel.chartJSON = JSON.stringify(prices);
      productModel.searchQuery = productModel.productId;
      productModel.partials = {
        common_head: 'common_head',
        navbar: 'navbar',
        content: 'product_page',
        product_info: 'product_info',
        product_store_info: 'product_store_info',
        product_store_info_small: 'product_store_info_small',
        product_store_table: 'product_store_table',
        store_drop_down: 'store_drop_down'
      };

      console.log(JSON.stringify(productModel));
      return res.render('common', productModel);
    });
  });
}

function convertPricesToHighAndLow(prices) {
  return [{
    type: 'high',
    shortName: 'Hi',
    price: prices[0].price/100,
    day: moment(prices[0].day.toString(), 'YYYYMMDD').format('DD MMM YY')
  },{
    type: 'low',
    shortName: 'Lo',
    price: prices[prices.length - 1].price/100,
    day: moment(prices[prices.length -1].day.toString(), 'YYYYMMDD').format('DD MMM YY')
  }];
}

module.exports = exports = {
  product : product
};
