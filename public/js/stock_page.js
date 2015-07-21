function displayStockPage(item)
{
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  resultsDiv.appendChild(generateProductInfoRow(item));

  generateStockTable(item, resultsDiv);
  generateMobileStockTable(item, resultsDiv);
  //generateStockInfo(item, resultsDiv);

  checkStockForAllStores(item);

}

function checkStockForAllStores(item)
{
  var productId = item.productId.replace("/", "");

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
      if(leftStoreDiv == null)
      {
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

  if(leftStoreDiv != null)
  {
    resultsDiv.appendChild(generateStockInfoRow(leftStoreDiv, rightStoreDiv));
  }
}

function generateMobileStockTable(item, resultsDiv)
{
  var rowCount = 0;

  var table = document.createElement("TABLE");
  table.setAttribute("class", "table table-striped visible-sm visible-xs");
  var tableBody = document.createElement("TBODY");

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
      row = document.createElement("tr");

      var storeName = key;
      var storeId = stores[key];

      var storeNameCell = document.createElement("td");
      storeNameCell.setAttribute("class", "storeNameCol");
      storeNameCell.innerHTML = storeName;
      var stockStatusCell = document.createElement("td");
      stockStatusCell.setAttribute("class", "stockStatusCol");
      var stockStatusContent = document.createElement('DIV');
      stockStatusContent.setAttribute("id", "store" + storeId);
      stockStatusContent.setAttribute("style", "position: relative; height:25px; top:50%;");

      var spinner = new Spinner(opts).spin(stockStatusContent);

      stockStatusCell.appendChild(stockStatusContent);

      row.appendChild(storeNameCell);
      row.appendChild(stockStatusCell);
      tableBody.appendChild(row);

    }
  }

  if(row != null)
  {
    tableBody.appendChild(row);
  }
  table.appendChild(tableBody);
  resultsDiv.appendChild(table);
}

function generateStockTable(item, resultsDiv)
{
  var row = null;
  var leftStorePopulated = false;
  var rowCount = 0;

  var table = document.createElement("TABLE");
  table.setAttribute("class", "table table-striped hidden-sm hidden-xs");
  var tableBody = document.createElement("TBODY");

  var stores = getStoreList();
  for(var key in stores)
  {
    if (stores.hasOwnProperty(key))
    {
      if(row == null)
      {
        row = document.createElement("tr");
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

      var storeNameCell = document.createElement("td");
      storeNameCell.setAttribute("class", "storeNameCol");
      storeNameCell.innerHTML = storeName;
      var stockStatusCell = document.createElement("td");
      stockStatusCell.setAttribute("class", "stockStatusCol");
      var stockStatusContent = document.createElement('DIV');
      stockStatusContent.setAttribute("id", "sm-store" + storeId);
      stockStatusContent.setAttribute("style", "position: relative; height:25px; top:50%;");

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

  if(row != null)
  {
    tableBody.appendChild(row);
  }
  table.appendChild(tableBody);
  resultsDiv.appendChild(table);
}

function generateStockInfoRow(leftStoreDiv, rightStoreDiv)
{
  var row = document.createElement('DIV');
  row.setAttribute("class", "row");

  row.appendChild(leftStoreDiv);
  if(rightStoreDiv != null)
  {
    row.appendChild(rightStoreDiv);
  }

  return row;
}

function generateProductInfoRow(item)
{
  var row = document.createElement('DIV');
  row.setAttribute("class", "row vertical-align");
  row.setAttribute("style", "padding-bottom:1em;");

  var imageDiv = document.createElement('DIV');
  imageDiv.setAttribute("class", "col-md-4 col-lg-4");
  imageDiv.setAttribute("style", "text-align: center;");
  var img = new Image();
  img.src = item.productImageUrl;
  imageDiv.appendChild(img);

  var productInfoDiv = document.createElement('DIV');
  productInfoDiv.setAttribute("class", "col-md-4 col-lg-4");
  productInfoDiv.setAttribute("style", "text-align: center;");

  var productId = item.productId.replace("/", "");
  var productUrl = "http://www.argos.ie/static/Product/partNumber/" + productId +".htm";

  var h = document.createElement("H3");
  var titleATag = document.createElement('a');
  titleATag.setAttribute('href',productUrl);
  titleATag.innerHTML = item.productName;
  h.appendChild(titleATag);



  var priceATag = document.createElement('a');
  priceATag.setAttribute('href',productUrl);
  priceATag.innerHTML = "Buy at Argos.ie - €" + item.price;

  productInfoDiv.appendChild(h);
  productInfoDiv.appendChild(priceATag);

  row.appendChild(imageDiv);
  row.appendChild(productInfoDiv);

  return row;
}

function appendStockStatus(itemJson, element)
{
  element.innerHTML = "";
  var glyphSpan = document.createElement("span");
  glyphSpan.setAttribute("aria-hidden", "true");

  var textSpan = document.createElement("span");
  textSpan.setAttribute("class", "hidden-xs");

  if (itemJson.isStocked)
  {
    glyphSpan.setAttribute("class", "glyphicon glyphicon-ok");
    glyphSpan.setAttribute("style", "color: green;font-size: 20px;");
    textSpan.setAttribute("style", "color: green;padding-left:1em; vertical-align: top;");
    textSpan.innerHTML = itemJson.stockQuantity + " in stock";
  }
  else if (itemJson.isOrderable)
  {
    glyphSpan.setAttribute("class", "glyphicon glyphicon-transfer");
    glyphSpan.setAttribute("style", "color: orange;font-size: 20px;");
    textSpan.setAttribute("style", "color: orange;padding-left:1em; vertical-align: top;");
    textSpan.innerHTML = "Orderable";
  }
  else if (itemJson.hasOutOfStockMessage)
  {
    glyphSpan.setAttribute("class", "glyphicon glyphicon-remove");
    glyphSpan.setAttribute("style", "color: red;font-size: 20px;");
    textSpan.setAttribute("style", "color: red;padding-left:1em; vertical-align: top;");
    textSpan.innerHTML = "Out of stock";
  }
  else
  {
    glyphSpan.setAttribute("class", "glyphicon glyphicon-question-sign");
    glyphSpan.setAttribute("style", "color: red;font-size: 20px;");
    textSpan.setAttribute("style", "color: red;padding-left:1em; vertical-align: top;");
    textSpan.innerHTML = "Unknown";
  }

  element.appendChild(glyphSpan);
  element.appendChild(textSpan);
}

function handleStoreStockStatus(itemJson, storeId)
{
  appendStockStatus(itemJson, document.getElementById("sm-store" + storeId));
  appendStockStatus(itemJson, document.getElementById("store" + storeId));
}
