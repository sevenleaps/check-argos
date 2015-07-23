var isClearancePage = false;

function displayClearanceSearch()
{
  hideHomeScreen();
  populateSearchBox("");
  isClearancePage = true;
  displayMessage("Clearance Search");
  var resultsDiv = document.getElementById('results');

  generateFilterSection(resultsDiv, false);

  return false;
}

function displaySearchResultPage(items)
{
  isClearancePage = false;
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  itemsList = items;

  generateFilterSection(resultsDiv, true);
  generateSearchResultsTable(items, resultsDiv);

  populatePreviouslySearchedFilters();
}

function displayClearanceResultPage(items)
{
  isClearancePage = true;
  populateSearchBox("");
  displayMessage("Clearance Search");
  var resultsDiv = document.getElementById('results');

  itemsList = items;

  generateFilterSection(resultsDiv, true);
  generateSearchResultsTable(items, resultsDiv);

  populatePreviouslySearchedFilters();
}

function populatePreviouslySearchedFilters()
{
  try{
    params = retrieveParams();

    if(params.search != null)
    {
      if(params.minPrice != null || params.minPrice != undefined)
      {
        document.getElementById(minPriceId).value = params.minPrice;
      }
      if(params.maxPrice != null || params.maxPrice != undefined)
      {
        document.getElementById(maxPriceId).value = params.maxPrice;
      }
      if(params.catagoryId != null || params.catagoryId != undefined)
      {
        if(params.catagoryId != 0)
        {
          $("#" + catagoriesDropDownId).val(params.catagoryId).attr("selected", "selected");
          $("#" + catagoriesDropDownId).selectmenu('refresh');
          // var catagoriesDropDown = document.getElementById(catagoriesDropDownId);
          // catagoriesDropDown.selectedIndex = params.catagoryId;
          // catagoriesDropDown.value = getCatagoriesList()[params.catagoryId];
        }
      }
    }
  }
  catch(err)
  {

  }
}

var itemsList = null;

var storeDropDownId = "storeDropDown";
var catagoriesDropDownId = "catagoriesDropDown";
var minPriceId = "minPriceInput";
var maxPriceId = "maxPriceInput";

function generateFilterSection(resultsDiv, showStoreFilter)
{
  var searchRow = document.createElement('DIV');
  searchRow.setAttribute("class", "row");

  var minPriceDiv = document.createElement('DIV');
  minPriceDiv.setAttribute("class", "form-group col-lg-3 col-md-3 col-sm-6 col-xs-6");
  minPriceDiv.setAttribute("style", "text-align: center;");

  // var minPriceText = document.createElement('label');
  // minPriceText.setAttribute("class", "control-label");
  // minPriceText.setAttribute("style", "padding-right: 0.5em;");
  // minPriceText.setAttribute("for", "minPriceId");
  // minPriceText.innerHTML = "Min Price";

  var minPriceInput = document.createElement("input");
  minPriceInput.setAttribute("class", "form-control");
  minPriceInput.setAttribute("name", "minPrice");
  minPriceInput.setAttribute("id", minPriceId);
  minPriceInput.setAttribute("placeholder", "Min Price");

  if(navigator.userAgent.indexOf("MSIE 9.") > -1){
    //IE 9 doesnt support input type
  }else{
    minPriceInput.type = "number";
  }

  // minPriceDiv.appendChild(minPriceText);
  minPriceDiv.appendChild(minPriceInput);

  var maxPriceDiv = document.createElement('DIV');
  maxPriceDiv.setAttribute("class", "form-group col-lg-3 col-md-3 col-sm-6 col-xs-6");
  maxPriceDiv.setAttribute("style", "text-align: center;");

  // var maxPriceText = document.createElement('label');
  // maxPriceText.setAttribute("class", "control-label");
  // maxPriceText.setAttribute("style", "padding-right: 0.5em;");
  // maxPriceText.setAttribute("for", "minPriceId");
  // maxPriceText.innerHTML = "Max Price";

  var maxPriceInput = document.createElement("input");
  maxPriceInput.setAttribute("class", "form-control");
  maxPriceInput.setAttribute("name", "maxPrice");
  maxPriceInput.setAttribute("id", maxPriceId);
  maxPriceInput.setAttribute("placeholder", "Max Price");

  if(navigator.userAgent.indexOf("MSIE 9.") > -1){
    //IE 9 doesnt support input type
  }else{
    maxPriceInput.type = "number";
  }

  //maxPriceDiv.appendChild(maxPriceText);
  maxPriceDiv.appendChild(maxPriceInput);

  searchRow.appendChild(minPriceDiv);
  searchRow.appendChild(maxPriceDiv);



  var catagoriesDiv = document.createElement('DIV');
  catagoriesDiv.setAttribute("class", "col-lg-3 col-md-3 col-sm-6 col-xs-6");
  catagoriesDiv.setAttribute("style", "text-align: center;");

  var catagoriesDropDown = generateCatagoriesDropDown();
  catagoriesDropDown.setAttribute("id", catagoriesDropDownId);
  //catagoriesDropDown.onchange = function(){ onStoreSelectChange();};

  catagoriesDiv.appendChild(catagoriesDropDown);
  searchRow.appendChild(catagoriesDiv);

  var searchButtonDiv = document.createElement('DIV');
  searchButtonDiv.setAttribute("class", "col-lg-3 col-md-3 col-sm-6 col-xs-6");
  searchButtonDiv.setAttribute("style", "text-align: center;");


  var searchButton = document.createElement("input");
  searchButton.setAttribute("class", "btn btn-primary");
  searchButton.type = "button";
  if(isClearancePage)
  {
    searchButton.value = "Search";
  }
  else
  {
    searchButton.value = "Update";
  }
  searchButton.onclick = function() {
      updateFilterSearch();
    };

  searchButtonDiv.appendChild(searchButton);
  searchRow.appendChild(searchButtonDiv);

  resultsDiv.appendChild(searchRow);

  if(showStoreFilter)
  {
    var outerRow = document.createElement('DIV');
    outerRow.setAttribute("class", "row");
    outerRow.setAttribute("style", "padding-bottom: 1em; border-bottom:solid 1px rgba(0, 0, 0, 0.1)");

    var storeSelecterDiv = document.createElement('DIV');
    storeSelecterDiv.setAttribute("class", "col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4 col-sm-offset-2 col-sm-8 col-xs-offset-2 col-xs-8");
    storeSelecterDiv.setAttribute("style", "text-align: center; padding-top:10px");

    var storeDropDown = generateStoreDropDown();
    storeDropDown.setAttribute("id", storeDropDownId);
    storeDropDown.onchange = function(){ onStoreSelectChange();};

    storeSelecterDiv.appendChild(storeDropDown);
    outerRow.appendChild(storeSelecterDiv);

    resultsDiv.appendChild(outerRow);
  }

}

function generateSearchResultsTable(items, resultsDiv)
{
  var outerRow = document.createElement('DIV');
  outerRow.setAttribute("class", "row");

  var div = document.createElement('DIV');

  var table = document.createElement("TABLE");
  table.setAttribute("class", "table table-striped");

  var headerRow = document.createElement('tr');
  headerRow.setAttribute("style", "padding-bottom: 1em; border-bottom:solid 1px rgba(0, 0, 0, 0.1)");

  var thead = document.createElement('thead');
  var imageHeaderCell = document.createElement("th");
  imageHeaderCell.innerHTML = "";
  var nameHeaderCell = document.createElement("th");
  nameHeaderCell.innerHTML = "Product Name";
  nameHeaderCell.setAttribute("style", "cursor: pointer;");
  var priceSavingHeaderCell = document.createElement("th");
  priceSavingHeaderCell.setAttribute("class", "");
  priceSavingHeaderCell.setAttribute("style", "text-align: center;  cursor: pointer;");
  priceSavingHeaderCell.innerHTML = "% Saving";
  var priceHeaderCell = document.createElement("th");
  priceHeaderCell.setAttribute("style", "text-align: center; cursor: pointer;");
  priceHeaderCell.innerHTML = "Price (€)";
  //priceHeaderCell.setAttribute("data-sort-method", "numeric;");

  var stockHeaderCell = document.createElement("th");
  stockHeaderCell.setAttribute("style", "text-align: center;");
  stockHeaderCell.setAttribute("class", "hide no-sort");
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
      itemPriceSavingCell.setAttribute("class", "");
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

      tbody.appendChild(row);
      table.appendChild(tbody);
    }
  }

  div.appendChild(table);
  if(navigator.userAgent.indexOf("MSIE 9.") > -1){
    //No sorting for IE 8 and IE 9
  }else{
    new Tablesort(table);
  }
  outerRow.appendChild(div);
  resultsDiv.appendChild(outerRow);
}

function updateFilterSearch()
{
  var minPrice = document.getElementById(minPriceId).value;
  if( minPrice === "")
  {
    minPrice = null;
  }

  var maxPrice = document.getElementById(maxPriceId).value;
  if( maxPrice === "")
  {
    maxPrice = null;
  }

  var catagoriesDropDown = document.getElementById(catagoriesDropDownId);
  var catagoryId = catagoriesDropDown.options[catagoriesDropDown.selectedIndex].value;
  var catagoryName = null;
  if(catagoryId !== 0)
  {
    catagoryName = getCatagoriesList()[catagoryId];
  }

  var query = document.getElementById("searchBox").value;

  advancedSearch(query, minPrice, maxPrice, catagoryId, isClearancePage);
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
      if(isValidItemData(item))
      {
        var productId = item.productId.replace("/", "");
        filterSearchRowByStockStatus(productId, storeId)
      }
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

  var span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");

  if (itemJson.isStocked)
  {
    span.setAttribute("class", "glyphicon glyphicon-ok");
    span.setAttribute("style", "color: green;font-size: 20px;");
  }
  else if (itemJson.isOrderable)
  {
    span.setAttribute("class", "glyphicon glyphicon-transfer");
    span.setAttribute("style", "color: orange;font-size: 20px;");
  }
  else if (itemJson.hasOutOfStockMessage)
  {
    span.setAttribute("class", "glyphicon glyphicon-remove");
    span.setAttribute("style", "color: red;font-size: 20px;");
  }
  else
  {
    span.setAttribute("class", "glyphicon glyphicon-question-sign");
    span.setAttribute("style", "color: red;font-size: 20px;");
  }

  element.appendChild(span);
}
