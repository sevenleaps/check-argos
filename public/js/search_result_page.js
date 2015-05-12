function displaySearchResultPage(items)
{
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  itemsList = items;

  generateFilterSection(resultsDiv);
  generateSearchResultsTable(items, resultsDiv);
}

var itemsList = null;

var storeDropDownId = "storeDropDown";

function generateFilterSection(resultsDiv)
{
  var outerRow = document.createElement('DIV');
  outerRow.setAttribute("class", "row");

  var storeSelecterDiv = document.createElement('DIV');
  storeSelecterDiv.setAttribute("class", "12u");
  storeSelecterDiv.setAttribute("style", "text-align: center;");

  var storeDropDown = generateStoreDropDown();
  storeDropDown.setAttribute("id", storeDropDownId);
  storeDropDown.onchange = function(){ onStoreSelectChange();};

  storeSelecterDiv.appendChild(storeDropDown);
  outerRow.appendChild(storeSelecterDiv);
  resultsDiv.appendChild(outerRow);
}

function generateSearchResultsTable(items, resultsDiv)
{
  var outerRow = document.createElement('DIV');
  outerRow.setAttribute("class", "row");

  var div = document.createElement('DIV');
  div.setAttribute("class", "12u");

  var table = document.createElement("TABLE");
  table.setAttribute("class", "default");

  var headerRow = document.createElement('tr');
  headerRow.setAttribute("style", "padding-bottom: 1em; border-bottom:solid 1px rgba(0, 0, 0, 0.1)");

  var thead = document.createElement('thead');
  var imageHeaderCell = document.createElement("th");
  imageHeaderCell.innerHTML = "";
  var nameHeaderCell = document.createElement("th");
  nameHeaderCell.innerHTML = "Product Name";
  var priceSavingHeaderCell = document.createElement("th");
  priceSavingHeaderCell.setAttribute("class", "hideCellOnMobile");
  priceSavingHeaderCell.setAttribute("style", "text-align: center;");
  priceSavingHeaderCell.innerHTML = "% Saving";
  var priceHeaderCell = document.createElement("th");
  priceHeaderCell.setAttribute("style", "text-align: center;");
  priceHeaderCell.innerHTML = "Price (€)";

  var stockHeaderCell = document.createElement("th");
  stockHeaderCell.setAttribute("style", "text-align: center;");
  stockHeaderCell.setAttribute("class", "hide");
  stockHeaderCell.setAttribute("name", "stockStatusColumn");
  stockHeaderCell.innerHTML = "Stock";

  headerRow.appendChild(imageHeaderCell);
  headerRow.appendChild(nameHeaderCell);
  headerRow.appendChild(priceSavingHeaderCell);
  headerRow.appendChild(priceHeaderCell);
  headerRow.appendChild(stockHeaderCell);

  table.appendChild(headerRow);

  var tbody = document.createElement('tbody');

  for (var i =0; i < items.length; i++ )
  {
    var item = items[i];
    if(isValidItemData(item))
    {
      var productId = item.productId.replace("/", "");
      var row = document.createElement('tr');
      row.setAttribute("id", "productId" + productId);
      row.setAttribute("style", "padding-bottom: 1em; border-bottom:solid 1px rgba(0, 0, 0, 0.1)");

      var itemImageCell = document.createElement("td");
      var img = new Image();
      img.src = item.productImageUrl;
      img.setAttribute("class", "itemProductImage");
      itemImageCell.appendChild(img);

      var itemNameCell = document.createElement("td");
      itemNameCell.setAttribute("style", "vertical-align:middle;");

      var productUrl = "?search=" + productId;
      var nameATag = document.createElement('a');
      nameATag.setAttribute('href',productUrl);
      nameATag.onclick = (function(tmpProductId) {
          return function()
          {
            return searchBoxSubmitWithReturnFalse(tmpProductId);
          };
        })(productId);

      nameATag.innerHTML = item.productName;
      itemNameCell.appendChild(nameATag);

      var precentageSaving = 0;
      if(item.previousPrice != 0)
      {
        precentageSaving = ((1 - (item.price/item.previousPrice))* 100).toFixed(0);
      }

      var itemPriceSavingCell = document.createElement("td");
      itemPriceSavingCell.setAttribute("style", "vertical-align:middle; text-align: center");
      itemPriceSavingCell.setAttribute("class", "hideCellOnMobile");
      itemPriceSavingCell.innerHTML = precentageSaving;

      var itemPriceCell = document.createElement("td");
      itemPriceCell.setAttribute("style", "vertical-align:middle; text-align: center");
      itemPriceCell.innerHTML = item.price;

      var stockStatusCell = document.createElement("td");
      stockStatusCell.setAttribute("style", "vertical-align:middle; text-align: center");
      stockStatusCell.setAttribute("class", "hide");
      stockStatusCell.setAttribute("name", "stockStatusColumn");
      stockStatusCell.setAttribute("id", "stockStatus" + productId);


      row.appendChild(itemImageCell);
      row.appendChild(itemNameCell);
      row.appendChild(itemPriceSavingCell);
      row.appendChild(itemPriceCell);
      row.appendChild(stockStatusCell);

      table.appendChild(row);
    }
  }

  div.appendChild(table);
  outerRow.appendChild(div);
  resultsDiv.appendChild(outerRow);
}

function isValidItemData(itemJson)
{
  if(itemJson.price === ".")
  {
    return false;
  }

  return true;
}

function onStoreSelectChange()
{
  var storeDropDown = document.getElementById(storeDropDownId);
  var storeId = storeDropDown.options[storeDropDown.selectedIndex].value;

  restoreStockFilterOfItems();

  if(storeId != 0)
  {
    updateStockColumnVisilbity(true);
    for(var i =0; i < itemsList.length; i++ )
    {
      var item = itemsList[i];
      var productId = item.productId.replace("/", "");
      filterSearchRowByStockStatus(productId, storeId)
    }
  }
  else
  {
    updateStockColumnVisilbity(false);
  }


}

function restoreStockFilterOfItems()
{
  for(var i =0; i < itemsList.length; i++ )
  {
    var item = itemsList[i];
    if(isValidItemData(item))
    {
      var productId = item.productId.replace("/", "");
      var element = document.getElementById("stockStatus" + productId);
      element.innerHTML = "";
    }
  }
}

function updateStockColumnVisilbity(visible)
{
  var columnElements = document.getElementsByName("stockStatusColumn");
  for(var i =0; i < columnElements.length; i++ )
  {
      var elem = columnElements[i];
      if(visible)
      {
        elem.setAttribute("class", "");
      }
      else
      {
        elem.setAttribute("class", "hide");
      }

  }

}

function handleItemRowsStockResponse(itemJson)
{
  var productId = itemJson.productId.replace("/", "");
  var element = document.getElementById("stockStatus" + productId);

  if (itemJson.isStocked)
  {
    element.innerHTML = "Yes";
  }
  else if (itemJson.isOrderable)
  {
    element.innerHTML = "Order";
  }
  else if (itemJson.hasOutOfStockMessage)
  {
    element.innerHTML = "No";
  }
  else
  {
    element.innerHTML = "?";
  }
}
