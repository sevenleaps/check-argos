var REFFERL_LINK= 'http://www.qksrv.net/links/7708057/type/am/http://www.argos.ie/static/Product/partNumber/';

function displayStockPage(item)
{
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  resultsDiv.appendChild(generateProductInfoRow(item));

  if(item.availableForReservation)
  {
    generateStockTable(item, resultsDiv);
    generateMobileStockTable(item, resultsDiv);
    //generateStockInfo(item, resultsDiv);
    checkStockForAllStores(item);
  }
  else if(item.availableForOnlinePurchase)
  {
    displayProductMessage("Item can be ordered online.", resultsDiv);
  }
  else {
    displayProductMessage("Check in store for availability.", resultsDiv);
  }
}

function displayProductMessage(message, resultsDiv)
{
  var row = document.createElement('DIV');
  row.setAttribute("class", "row");
  row.setAttribute("style", "text-align: center;");

  var h = document.createElement("H3");
  h.innerHTML = message;
  row.appendChild(h);
  resultsDiv.appendChild(row);
}


function checkStockForAllStores(item) {
  var productId = item.productId.replace('/', '');

  var stores = getStoreList();
  for(var key in stores)
  {
    if (stores.hasOwnProperty(key))
    {
      checkStockForSingleStore(productId, stores[key]);
    }
  }
}

function generateStockInfo(item, resultsDiv)
{
  var leftStoreDiv = null;
  var rightStoreDiv = null;

  for(var key in stores)
  {
    if (stores.hasOwnProperty(key))
    {
      if(leftStoreDiv === null) {
        leftStoreDiv = generateStoreDiv(key, stores[key]);
      }
      else
      {
        rightStoreDiv = generateStoreDiv(key, stores[key]);
        resultsDiv.appendChild(generateStockInfoRow(leftStoreDiv, rightStoreDiv));
        leftStoreDiv = null;
        rightStoreDiv = null;
      }

    }
  }

  if (leftStoreDiv !== null) {
    resultsDiv.appendChild(generateStockInfoRow(leftStoreDiv, rightStoreDiv));
  }
}

function generateMobileStockTable(item, resultsDiv) {
  var rowCount = 0;

  var table = document.createElement('TABLE');
  table.setAttribute('class', 'table table-striped visible-sm visible-xs');
  var tableBody = document.createElement('TBODY');

  var stores = getStoreList();
  for(var key in stores)
  {
    if (stores.hasOwnProperty(key))
    {
      var opts = {
        lines: 7, // The number of lines to draw
        length: 3, // The length of each line
        width: 3, // The line thickness
        radius: 3, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
      };
      var row = document.createElement('tr');

      var storeName = key;
      var storeId = stores[key];

      var storeNameCell = document.createElement('td');
      storeNameCell.setAttribute('class', 'storeNameCol');
      storeNameCell.appendChild(createProductTextLink(item.productId, storeName));
      var stockStatusCell = document.createElement('td');
      stockStatusCell.setAttribute('class', 'stockStatusCol');
      var stockStatusContent = document.createElement('DIV');
      stockStatusContent.setAttribute('id', 'store' + storeId);
      stockStatusContent.setAttribute('style', 'position: relative; height:25px; top:50%;');

      var spinner = new Spinner(opts).spin(stockStatusContent);

      stockStatusCell.appendChild(stockStatusContent);

      row.appendChild(storeNameCell);
      row.appendChild(stockStatusCell);
      tableBody.appendChild(row);

    }
  }

  if (row !== null) {
    tableBody.appendChild(row);
  }
  table.appendChild(tableBody);
  resultsDiv.appendChild(table);
}

function createProductTextLink(productId, linkName) {
  var a = document.createElement('a');
  var linkText = document.createTextNode(linkName);
  a.appendChild(linkText);
  a.title = linkName;
  a.href = REFFERL_LINK + productId.replace('/', '') + '.htm';
  a.id = 'productLinkC';
  a.setAttribute('onclick','logClickThrough("'+ productId.replace('/', '') +'", \"productLinkC\");');
  return a;
}

function createProductImageLink(productId, img) {
  var a = document.createElement('a');
  a.appendChild(img);
  a.href = REFFERL_LINK + productId.replace('/', '') + '.htm';
  a.id = 'productLinkD';
  a.setAttribute('onclick','logClickThrough("'+ productId.replace('/', '')  +'", \"productLinkD\");');
  return a;
}

function generateStockTable(item, resultsDiv)
{
  var row = null;
  var leftStorePopulated = false;
  var rowCount = 0;

  var table = document.createElement('TABLE');
  table.setAttribute('class', 'table table-striped hidden-sm hidden-xs');
  var tableBody = document.createElement('TBODY');

  var stores = getStoreList();
  for(var key in stores)
  {
    if (stores.hasOwnProperty(key))
    {
      if(row === null) {
        row = document.createElement('tr');
      }
      var opts = {
        lines: 7, // The number of lines to draw
        length: 3, // The length of each line
        width: 3, // The line thickness
        radius: 3, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
      };

      var storeName = key;
      var storeId = stores[key];

      var storeNameCell = document.createElement('td');
      storeNameCell.setAttribute('class', 'storeNameCol');
      storeNameCell.appendChild(createProductTextLink(item.productId, storeName)); //= storeName;
      var stockStatusCell = document.createElement('td');
      stockStatusCell.setAttribute('class', 'stockStatusCol');
      var stockStatusContent = document.createElement('DIV');
      stockStatusContent.setAttribute('id', 'sm-store' + storeId);
      stockStatusContent.setAttribute('style', 'position: relative; height:25px; top:50%;');

      var spinner = new Spinner(opts).spin(stockStatusContent);

      stockStatusCell.appendChild(stockStatusContent);
      row.appendChild(storeNameCell);
      row.appendChild(stockStatusCell);

      if(leftStorePopulated)
      {
        tableBody.appendChild(row);
        leftStorePopulated = false;
        row = null;
      }
      else
      {
        leftStorePopulated = true;
      }

    }
  }

  if(row !== null)
  {
    tableBody.appendChild(row);
  }
  table.appendChild(tableBody);
  resultsDiv.appendChild(table);
}

function generateStockInfoRow(leftStoreDiv, rightStoreDiv)
{
  var row = document.createElement('DIV');
  row.setAttribute('class', 'row');

  row.appendChild(leftStoreDiv);
  if(rightStoreDiv !== null)
  {
    row.appendChild(rightStoreDiv);
  }

  return row;
}

function logClickThrough(productID, id)
{
  var href = $('#' + id).attr('href');
  var re = new RegExp('^http:\/\/www\.argos\.ie');
  if (href.match(re)) {
    ga('send', 'event', 'linkClick', 'argos', productID);
  }
  else
  {
    //$("#" + id).attr('href', "http://" + href);
    keen.addEvent('clicked.referral',{
      productId: productID,
      linkType: id
      })
    ga('send', 'event', 'linkClick', 'refferal', productID);
  }
}

function generateProductInfoRow(item)
{
  var row = document.createElement('DIV');
  row.setAttribute('class', 'row vertical-align');
  row.setAttribute('style', 'padding-bottom:1em;');

  var imageDiv = document.createElement('DIV');
  imageDiv.setAttribute('class', 'col-md-4 col-lg-4');
  imageDiv.setAttribute('style', 'text-align: center;');
  var img = new Image();
  img.src = item.productImageUrl;
  var productImageLink = createProductImageLink(item.productId, img);
  imageDiv.appendChild(productImageLink);


  var productInfoDiv = document.createElement('DIV');
  productInfoDiv.setAttribute('class', 'col-md-4 col-lg-4');
  productInfoDiv.setAttribute('style', 'text-align: center;');

  var productInfoRow = document.createElement('DIV');
  productInfoRow.setAttribute('class', 'row');
  var productGraphRow = document.createElement('DIV');
  productGraphRow.setAttribute('class', 'row');

  var productId = item.productId.replace('/', '');
  var productUrl = REFFERL_LINK + productId + '.htm';

  var h = document.createElement('H3');
  var titleATag = document.createElement('a');
  titleATag.setAttribute('id', 'productLinkA');
  titleATag.setAttribute('href', productUrl);
  titleATag.setAttribute('onclick','logClickThrough("'+ productId +'", \"productLinkA\");');
  titleATag.innerHTML = item.productName;
  h.appendChild(titleATag);



  var priceATag = document.createElement('a');
  priceATag.setAttribute('id', 'productLinkB');
  priceATag.setAttribute('href',productUrl);
  priceATag.setAttribute('onclick','logClickThrough("'+ productId +'", \"productLinkB\");');
  priceATag.innerHTML = 'Buy at Argos.ie - €' + item.price;

  var highestPastPrice = document.createElement('DIV');
  highestPastPrice.setAttribute('id', 'high');
  highestPastPrice.setAttribute('style', 'text-align: center; font-size: 12px;');
  highestPastPrice.innerHTML='Checking highest price ...';
  getPastPrices(item.productId);
  var lowestPastPrice = document.createElement('DIV');
  lowestPastPrice.setAttribute('id', 'low');
  lowestPastPrice.setAttribute('style', 'text-align: center; font-size: 12px;');
  lowestPastPrice.innerHTML='Checking lowest price ...';
  // Price history
  var canvas = document.createElement('canvas');
  canvas.id = 'myChart';
  canvas.length = 300;
  canvas.height = 150;

  var priceHistoryRow = document.createElement('DIV');
  priceHistoryRow.setAttribute('class', 'visible-xs');

  var priceHistory = document.createElement('a');
  priceHistory.innerHTML = 'Graph price history';
  priceHistory.setAttribute('id', 'priceHistory');
  priceHistory.setAttribute('style','visibility:hidden');
  priceHistory.setAttribute('onclick','toggle()');

  productInfoRow.appendChild(h);
  productInfoRow.appendChild(highestPastPrice);
  productInfoRow.appendChild(lowestPastPrice);
  productInfoRow.appendChild(priceATag);

  priceHistoryRow.appendChild(priceHistory);

  productGraphRow.appendChild(canvas);
  productGraphRow.setAttribute('id', 'productGraphRow');
  productGraphRow.setAttribute('class', 'row hidden-xs');

  productInfoDiv.appendChild(productInfoRow);
  productInfoDiv.appendChild(priceHistoryRow);
  productInfoDiv.appendChild(productGraphRow);
  row.appendChild(imageDiv);
  row.appendChild(productInfoDiv);

  return row;
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

function appendStockStatus(itemJson, element) {
  element.innerHTML = '';
  var icon = document.createElement('i');
  icon.setAttribute('aria-hidden', 'true');

  var textSpan = document.createElement('span');
  textSpan.setAttribute('class', 'hidden-xs');
  var mobileTextSpan = document.createElement('span');
  mobileTextSpan.setAttribute('class', 'custom-xs');

  if (itemJson.isStocked)
  {
    icon.setAttribute('class', 'fa fa-check');
    icon.setAttribute('style', 'color: green;font-size: 20px;');
    textSpan.setAttribute('style', 'color: green;padding-left:1em; vertical-align: top;');
    textSpan.innerHTML = itemJson.stockQuantity + ' in stock';
    mobileTextSpan.setAttribute('style', 'color: green;padding-left:1em; vertical-align: top;');
    mobileTextSpan.innerHTML = itemJson.stockQuantity;
  }
  else if (itemJson.isOrderable)
  {
    icon.setAttribute('class', 'fa fa-truck');
    icon.setAttribute('style', 'color: orange;font-size: 20px;');
    textSpan.setAttribute('style', 'color: orange;padding-left:1em; vertical-align: top;');
    textSpan.innerHTML = 'Orderable';
  }
  else if (itemJson.hasOutOfStockMessage)
  {
    icon.setAttribute('class', 'fa fa-close');
    icon.setAttribute('style', 'color: red;font-size: 20px;');
    textSpan.setAttribute('style', 'color: red;padding-left:1em; vertical-align: top;');
    textSpan.innerHTML = 'Out of stock';
  }
  else
  {
    icon.setAttribute('class', 'fa fa-question');
    icon.setAttribute('style', 'color: red;font-size: 20px;');
    textSpan.setAttribute('style', 'color: red;padding-left:1em; vertical-align: top;');
    textSpan.innerHTML = 'Unknown';
  }

  element.appendChild(icon);
  element.appendChild(textSpan);
  element.appendChild(mobileTextSpan);
}

function handleStoreStockStatus(itemJson, storeId) {
  if(document.getElementById('sm-store' + storeId) !== null && document.getElementById('store' + storeId) !== null){
    appendStockStatus(itemJson, document.getElementById('sm-store' + storeId));
    appendStockStatus(itemJson, document.getElementById('store' + storeId));
  }
}
