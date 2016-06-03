var REFERRAL_LINK= 'http://www.qksrv.net/links/7708057/type/am/http://www.argos.ie/static/Product/partNumber/';

function logClickThrough(productID, id)
{
  var href = $('#' + id).attr('href');
  var re = new RegExp('^http:\/\/www\.argos\.ie');
  if (href.match(re)) {
    ga('send', 'event', 'linkClick', 'argos', productID);
  }
  else
  {
    keen && keen.addEvent('clicked.referral',{
      productId: productID,
      linkType: id
    });
    ga('send', 'event', 'linkClick', 'refferal', productID);
  }
}

function toggle() {
  if ( $('#productGraphRow').attr('class') == 'row hidden-xs' ) {
    $('#myChart').css('visibility','visible');
    $('#productGraphRow').attr('class','row');
    initChart(prices);
  } else {
    $('#myChart').css('visibility','hidden');
    $('#productGraphRow').attr('class','row hidden-xs');
  }
}
var prices = [];
function getPastPrices(productId) {
  function reqListener () {
    var high = document.getElementById('high');
    var low = document.getElementById('low');
    if(high !== null && low !== null){
      prices = JSON.parse(this.responseText);
      if (!isBreakpoint('xs')) {
        initChart(prices);
      } else {
        $('#priceHistory').css('visibility','visible');
      }
      var sortedPrices = prices.slice(0);
      sortedPrices.sort(function (a,b) {return b.price - a.price;});
      low.innerHTML='Lo: ' + ' €' + sortedPrices[prices.length - 1].price/100 + ' - ' + moment(sortedPrices[prices.length - 1].day.toString(), 'YYYYMMDD').format('DD MMM YY');
      high.innerHTML='Hi: ' + ' €' + sortedPrices[0].price/100 + ' - ' + moment(prices[0].day.toString(), 'YYYYMMDD').format('DD MMM YY');
    }
  }

  var url = '/stockcheck/price/' + productId.replace('/', '');

  var oReq = new XMLHttpRequest();
  oReq.addEventListener('load', reqListener);
  oReq.open('get', url, true);
  oReq.send();
}

function isBreakpoint( alias ) {
  return $('.device-' + alias).is(':visible');
}

function resetStockStatus(storeId)
{
  document.getElementById('sm-store' + storeId) && addSpinnerToStockStatus(document.getElementById('sm-store' + storeId));
  document.getElementById('store' + storeId) && addSpinnerToStockStatus(document.getElementById('store' + storeId));
}

function handleStoreStockStatus(itemJson, storeId) {

  var element = document.getElementById('sm-store' + storeId);
  element && appendStockStatus(itemJson, element, function(){
    resetStockStatus(storeId);
    checkStockForSingleStore(itemJson.productId, storeId);
  }, true);

  element = document.getElementById('store' + storeId);
  element && appendStockStatus(itemJson, element, function(){
    resetStockStatus(storeId);
    checkStockForSingleStore(itemJson.productId, storeId);
  }, false);

}
