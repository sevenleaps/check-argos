var request = require('request');
var stockController = require('../stock/stock_controllers.js');
var REFFERL_LINK= 'http://www.qksrv.net/links/7708057/type/am/http://www.argos.ie/static/Product/partNumber/';
var storesJSON = require('../assets/stores.json');

function product(req, res, next){
  stockController.getPriceHistoryInternal(req, function onPrices(error, prices) {
    var number = 0;
    if (error) {
      return res.render('error', error);
    }
    console.log(prices);
    request('http://www.checkargos.com/search/simple?q=' + req.params.productId, function (error, response, productString){
      var productModel = JSON.parse(productString);
      productModel.productId = req.params.productId;
      productModel.prices = convertPricesToHighAndLow(prices);
      productModel.stores = storesJSON;
      productModel.tableRowStart = function isEven(){
        var returnValue = "";
        number++;
        if((number%2)==1){
          returnValue = "<tr>";
        }
        return returnValue;
      };
      productModel.tableRowEnd = function isEven(){
        var returnValue = "";
        if((number%2)==0){
          returnValue = "</tr>";
        }
        return returnValue;
      };
      productModel.referl = REFFERL_LINK + productModel.productId.replace('/', '') + '.htm';
      productModel.title = 'Checkargos.com - An Irish Stock Checker';
      productModel.chartJSON = JSON.stringify(prices);
      productModel.searchQuery = productModel.productId;
      productModel.partials = {
        common_head: 'common_head',
        navbar: 'navbar',
        content: 'product_page',
        product_info: 'product_info',
        product_store_info: 'product_store_info',
        product_store_table: 'product_store_table'
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
    price: prices[0].price,
    day: prices[0].day
  },{
    type: 'low',
    shortName: 'Lo',
    price: prices[prices.length - 1].price,
    day: prices[prices.length -1].day
  }]
}

module.exports = exports = {
  product : product
};