var mongodb = require('mongodb-then');
var moment = require('moment');

var db = mongodb('sevenleaps:S1lk4dose@ds037244.mongolab.com:37244/stockspy', [
  'product','price'
]);
//Converter Class
var fs = require('fs');
var Converter = require('csvtojson').Converter;
var fileStream = fs.createReadStream('/Users/conor/repos/check-argos/argos_uk_365.csv');
//new converter instance
var converter = new Converter({constructResult:true});
//end_parsed will be emitted once parsing finished
converter.on('end_parsed', function (prices) {

  insertTwenty(prices).catch(function (err) {
    console.log(err);
  });

});
//read from file
fileStream.pipe(converter);

function getTwenty(array) {
  var twenty = [];
  for (var i = 0; i < 20; i++) {
    var element = array.shift();
    if (element) {
      twenty.push(element);
    }
  }
  return twenty;
}

var count = 0;
function insertTwenty(prices) {
  var twenty = getTwenty(prices);
  if (twenty.length === 0) {return;}
  return db.price.insertMany(twenty).then(function () {
    console.log('Great success!' + count);
    count = count + 20;
    return insertTwenty(prices);
  });
}

var productId = "2627443"//productInfoJson.productId.replace('/', '');

// db.price.find({'productId': Number.parseInt(productId)}).sort({'$natural': -1}).limit(1).then(function (array) {
//   console.log(array);
// })

// var productPrice = productInfoJson.price.replace('.', '');
//
// var currentPrice = {
//   'productId': Number.parseInt(productId),
//   'price': Number.parseInt(productPrice),
//   'day': moment().format()
// };
//
// db.price.find({'productId': Number.parseInt(productId)}).sort({'$natural': -1}).limit(1).then(function (prices) {
//   if (prices.length === 0) {
//     // new product price history
//     return db.price.insertOne(currentPrice);
//   }
//
//   var isNewPrice = prices[0].price !== currentPrice.price;
//   var isDifferentDate = prices[0].price.day !== currentPrice.day;
//
//   if (isNewPrice  && isDifferentDate) {
//     // add new price
//     return db.price.insertOne(currentPrice);
//   }
// }).catch(function (err) {
//   console.log('Error uupdating price history');
//   console.log(err);
// });
