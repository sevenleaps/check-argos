var isClearancePage = false;
var currentPage = 1;

function displayPopularProductsPage(days)
{
  if(days == "recent")
  {
    days = 2;
  }
  ga('send', 'pageview', '/popular');
  hideHomeScreen();
  hideAboutScreen();
  populateSearchBox("");
  displaySpinner();
  var pushStateUrl = "?popular=" + days;
  if(navigator.userAgent.indexOf("MSIE 9.") > -1){
    //History not supported - Go to page
    if(location.search !== pushStateUrl){
      location.href = pushStateUrl;
    }
  }else{
    window.history.pushState(null, null, pushStateUrl);
  }
  $.ajax("/popular/recent?limit=20&days=" + days).done(displayPopularProductsResultPage);
  return false;
}

function displayPopularProductsResultPage(result)
{
  itemsList = result;
  populateSearchBox("");
  hideAboutScreen();
  hideHomeScreen();
  displayMessage("Recent Popular Products");
  var resultsDiv = document.getElementById('results');
  generateStoreFilter(resultsDiv);
  generateSearchResultsTable(result, resultsDiv);
}

function displayClearanceSearch()
{
  hideHomeScreen();
  hideAboutScreen();
  populateSearchBox("");
  isClearancePage = true;
  displayMessage("Clearance Search");
  var resultsDiv = document.getElementById('results');

  generateFilterSection(resultsDiv, true);
  disableFilterButtonByDropdown();
  $( "#filterButton").addClass('disabled');
  return false;
}

function disableFilterButtonByDropdown()
{
  $( "#" + catagoriesDropDownId ).change(function()
  {

    if(this.selectedIndex == 0)
    {
      $( "#filterButton").addClass('disabled');
    }
    else
    {
      $( "#filterButton").removeClass('disabled');
    }
  });

}

function displaySearchResultPage(result)
{
  isClearancePage = false;
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";
  hideAboutScreen();


  if(result.hasOwnProperty("items"))
  {
    itemsList = result.items;
    generateFilterSection(resultsDiv, true);
    createPaginationIfNeeded(result, resultsDiv);
    generateSearchResultsTable(itemsList, resultsDiv);
    createPaginationIfNeeded(result, resultsDiv);
    populatePreviouslySearchedFilters();
  }
}

function createPaginationIfNeeded(result, resultsDiv)
{
  if(result.hasOwnProperty("totalNumProducts"))
  {
    var totalNum = result.totalNumProducts;
    if(totalNum > productsPerPage)
    {
      var currentPage = 1;
      var numPages = (totalNum/productsPerPage) + 1;
      var params = retrieveParams();
      if(params.page != null || params.page != undefined)
      {
        currentPage = params.page;
      }

      var paginationDiv = document.createElement('DIV');
      paginationDiv.setAttribute("class", "row");
      paginationDiv.setAttribute("style", "text-align: center;");
      var paginationUl = document.createElement('ul');
      paginationUl.setAttribute("class", "pagination");
      paginationUl.setAttribute("style", "margin-bottom: 0px; margin-top: 12px;");
      for(var i = 1; i <= numPages; i++)
      {
        var li = document.createElement('li');
        if(i == currentPage)
        {
          li.setAttribute("class", "active");
        }
        var aTag = document.createElement('a');
        aTag.setAttribute("onclick", "return handlePagination(" + i + ")");
        aTag.setAttribute("href", "#page" + i);
        aTag.innerHTML = i;

        li.appendChild(aTag);
        paginationUl.appendChild(li);
      }
      paginationDiv.appendChild(paginationUl);
      resultsDiv.appendChild(paginationDiv);
    }
  }
}

function handlePagination(page)
{
  updateSearch(page);
  return false;
}

function displayClearanceResultPage(result)
{
  isClearancePage = true;
  populateSearchBox("");
  hideAboutScreen();
  displayMessage("Clearance Search");
  var resultsDiv = document.getElementById('results');

  if(result.hasOwnProperty("items"))
  {
    itemsList = result.items;
    generateFilterSection(resultsDiv, true);
    createPaginationIfNeeded(result, resultsDiv);
    generateSearchResultsTable(itemsList, resultsDiv);
    createPaginationIfNeeded(result, resultsDiv);
    populatePreviouslySearchedFilters();
    disableFilterButtonByDropdown();
  }
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
      if(params.storeId != null || params.storeId != undefined)
      {
        updateDropDown(params.storeId, storeDropDownId);
        onStoreSelectChange();
      }
      if(params.catagoryId != null || params.catagoryId != undefined)
      {
        updateDropDown(params.catagoryId, catagoriesDropDownId);
      }
      if(params.page != null || params.page != undefined)
      {
        currentPage = params.page;
      }
    }
  }
  catch(err)
  {
    console.log(err);
  }
}

function updateDropDown(value, elemId)
{
  if(value != null || value != undefined)
  {
    if(value != 0)
    {
      $("#" + elemId).val(value).attr("selected", "selected");
    }
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

  var catagoriesDropDown;
  if(isClearancePage)
  {
    catagoriesDropDown = generateCatagoriesDropDown("-- Select a catagory --");
  }
  else
  {
    catagoriesDropDown = generateCatagoriesDropDown();
  }
  catagoriesDropDown.setAttribute("id", catagoriesDropDownId);
  //catagoriesDropDown.onchange = function(){ onStoreSelectChange();};

  catagoriesDiv.appendChild(catagoriesDropDown);
  searchRow.appendChild(catagoriesDiv);

  var searchButtonDiv = document.createElement('DIV');
  searchButtonDiv.setAttribute("class", "col-lg-3 col-md-3 col-sm-6 col-xs-6");
  searchButtonDiv.setAttribute("style", "text-align: center;");


  var searchButton = document.createElement("input");
  searchButton.setAttribute("id", "filterButton");
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
    generateStoreFilter(resultsDiv);
  }

}

function generateStoreFilter(resultsDiv)
{
  var outerRow = document.createElement('DIV');
  outerRow.setAttribute("class", "row");
  //outerRow.setAttribute("style", "padding-bottom: 1em;");

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

function generateSearchResultsTable(items, resultsDiv)
{
  var outerRow = document.createElement('DIV');
  outerRow.setAttribute("class", "row");
  outerRow.setAttribute("style", "margin-top: 0.8em; border-top:solid 1px rgba(0, 0, 0, 0.1)");

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
  updateSearch(1);
}

function updateSearch(page)
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

  var storeDropDown = document.getElementById(storeDropDownId);
  var storeId = storeDropDown.options[storeDropDown.selectedIndex].value;

  var query = document.getElementById("searchBox").value;

  advancedSearch(query, minPrice, maxPrice, catagoryId, isClearancePage, storeId, page);
}

function isValidItemData(itemJson)
{
  if(itemJson.price === ".")
  {
    return false;
  }

  return true;
}

function onStoreDropDownChange(storeId){
  restoreStockFilterOfItems();
  var itemList = document.getElementsByClassName("product-id");
  if(storeId != 0 && itemList.length > 0){
    updateStockColumnVisilbity(true);
    for(var i = 0; i < itemList.length; i++){
      var itemPrice = itemList[i].getElementsByClassName("product-price");
      if(itemPrice[0].innerHTML !== "."){
        var productId = itemList[i].id.replace("productId", "");
        var element = document.getElementById("stockStatus" + productId);
        element.innerHTML = "";
        filterSearchRowByStockStatus(productId, storeId, true);
      }
    }
  }
  else
  {
    updateStockColumnVisilbity(false);
  }
}

function onStoreSelectChange()
{
  var storeDropDown = document.getElementById(storeDropDownId);
  var storeId = storeDropDown.options[storeDropDown.selectedIndex].value;

  restoreStockFilterOfItems();

  if(storeId != 0 && itemsList != null)
  {
    updateStockColumnVisilbity(true);
    for(var i =0; i < itemsList.length; i++ )
    {
      var item = itemsList[i];
      if(isValidItemData(item))
      {
        var productId = item.productId.replace("/", "");
        filterSearchRowByStockStatus(productId, storeId, false);
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
  if(itemsList != null)
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

function resetStockStatusForProduct(productId)
{
  document.getElementById("stockStatus" + productId) && addSpinnerToStockStatus(document.getElementById("stockStatus" + productId));
}

function handleItemRowsStockResponse(itemJson, storeId, isPopular) {
  var element = document.getElementById("stockStatus" + itemJson.productId);
  element && appendStockStatus(itemJson, element, function(){
    resetStockStatusForProduct(itemJson.productId);
    checkStockForSingleStore(itemJson.productId, storeId);
  }, true, isPopular);
}
