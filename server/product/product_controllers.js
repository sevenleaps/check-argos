var request = require('request');
var stockController = require('../stock/stock_controllers.js');
var REFFERL_LINK= 'http://www.qksrv.net/links/7708057/type/am/http://www.argos.ie/static/Product/partNumber/';

function product(req, res, next){
  stockController.getPriceHistoryInternal(req, function onPrices(error, prices) {
    if (error) {
      return res.render('error', error);
    }
    console.log(prices);
    request('http://www.checkargos.com/search/simple?q=' + req.params.productId, function (error, response, productString){
     var productModel = JSON.parse(productString);
     productModel.productId = req.params.productId;
     productModel.prices = convertPricesToHighAndLow(prices);
     productModel.referl = REFFERL_LINK + productModel.productId.replace('/', '') + '.htm';

     productModel.title = 'Checkargos.com - An Irish Stock Checker';
     productModel.chartJSON = JSON.stringify(prices);
     productModel.searchQuery = productModel.productId;
     productModel.partials = {
       common_head: 'common_head',
       navbar: 'navbar',
       content: 'productinfo'
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
