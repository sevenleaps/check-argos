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

      row = document.createElement("tr");

      var storeName = key;
      var storeId = stores[key];

      var storeNameCell = document.createElement("td");
      storeNameCell.setAttribute("class", "storeNameCol");
      storeNameCell.innerHTML = storeName;
      var stockStatusCell = document.createElement("td");
      stockStatusCell.setAttribute("class", "stockStatusCol");
      stockStatusCell.setAttribute("name", "store" + storeId);

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

      var storeName = key;
      var storeId = stores[key];

      var storeNameCell = document.createElement("td");
      storeNameCell.setAttribute("class", "storeNameCol");
      storeNameCell.innerHTML = storeName;
      var stockStatusCell = document.createElement("td");
      stockStatusCell.setAttribute("class", "stockStatusCol");
      stockStatusCell.setAttribute("name", "store" + storeId);

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

function generateStoreDiv(storeName, storeId)
{
  var storeDiv = document.createElement('DIV');
  storeDiv.setAttribute("class", "6u");
  storeDiv.setAttribute("style", "text-align: center;");
  //storeDiv.setAttribute("id", "store" + storeId);
  var table = document.createElement("TABLE");
  table.setAttribute("class", "default");
  var row = document.createElement("tr");
  var storeNameCell = document.createElement("td");
  storeNameCell.innerHTML = storeName;
  var stockStatusCell = document.createElement("td");
  stockStatusCell.setAttribute("id", "store" + storeId);
  stockStatusCell.innerHTML = "Checking...";

  row.appendChild(storeNameCell);
  row.appendChild(stockStatusCell);

  table.appendChild(row);

  storeDiv.appendChild(table);

  return storeDiv;

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

function handleStoreStockStatus(itemJson, storeId)
{

  var elementsToBeUpdated = document.getElementsByName("store" + storeId);

  for(element in elementsToBeUpdated)
  {
    if (elementsToBeUpdated.hasOwnProperty(element))
    {
      var elem = elementsToBeUpdated[element];

      if (itemJson.isStocked)
      {
        elem.innerHTML = itemJson.stockQuantity + " in stock."
      }
      else if (itemJson.isOrderable)
      {
        elem.innerHTML = "Can be ordered.";
      }
      else if (itemJson.hasOutOfStockMessage)
      {
        elem.innerHTML = "Out of stock.";
      }
      else
      {
        elem.innerHTML = "Unknown status.";
      }
    }
  }
}
