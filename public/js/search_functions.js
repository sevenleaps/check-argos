var productsPerPage = 40;

function searchByQuery (searchQuery)
{
  var url = '?search=' + searchQuery;
  if(navigator.userAgent.indexOf("MSIE 9.") > -1){
    //History not supported - Go to page
    if(location.search !== url){
      location.href = url;
    }
  }else{
    window.history.pushState(null, null, url);
  }
  searchByQueryNoHistory(searchQuery);
}

function searchViaAJAX(url, clearance){
  var myRequest = new XMLHttpRequest();
  myRequest.onload = function(){
    handleResponseFromSearch(myRequest.responseText, clearance);
  };
  myRequest.open("GET", url);
  myRequest.send();
}

function searchByQueryNoHistory(searchQuery){
  displaySpinner();
  var url = "search/simple?q=" +  searchQuery;
  searchViaAJAX(url);
}

var noResults = "No Results";

function advancedSearch (query, minPrice, maxPrice, catagoryId, clearance, storeId, page)
{
  if(minPrice === null && maxPrice === null && catagoryId == 0 && page == null)
  {
    //no need for advanced search
    searchByQuery(query);
  }
  else
  {
    displaySpinner();
    var urlForAdvancedQuery = generatePushStateUrlForAdvancedSearch(query, minPrice, maxPrice, catagoryId, clearance, storeId, page);
    //TODO Populate this properly!
    if(navigator.userAgent.indexOf("MSIE 9.") > -1){
      //History not supported - Go to page
      if(location.search !== urlForAdvancedQuery){
        location.href = urlForAdvancedQuery;
      }
    }else{
      window.history.pushState(null, null, urlForAdvancedQuery);
    }
    searchViaAJAX(generateAdvancedSearchUrl(query, minPrice, maxPrice, catagoryId, clearance, page), clearance);
  }
}

function advancedSearchNoHistory (query, minPrice, maxPrice, catagoryId, clearance, storeId, page)
{
  if(minPrice === null && maxPrice === null && catagoryId == 0 && page == null)
  {
    //no need for advanced search
    searchByQueryNoHistory(query);
  }
  else
  {
    displaySpinner();
    searchViaAJAX(generateAdvancedSearchUrl(query, minPrice, maxPrice, catagoryId, clearance, page), clearance);
  }
}

function generatePushStateUrlForAdvancedSearch(query, minPrice, maxPrice, catagoryId, clearance, storeId, page)
{
  var url = "?search=" +  query;
  if(minPrice !== null)
  {
    url = url + "&minPrice=" + minPrice;
  }

  if(maxPrice !== null)
  {
    url = url + "&maxPrice=" + maxPrice;
  }

  if(catagoryId != 0)
  {
    url = url + "&catagoryId=" + catagoryId;
  }

  if(clearance)
  {
    url = url + "&isClearance=true"
  }

  if(storeId !== null)
  {
    url = url + "&storeId=" + storeId;
  }

  if(page)
  {
    url = url + "&page=" + page;
  }

  return url;
}

function generateAdvancedSearchUrl(query, minPrice, maxPrice, catagoryId, clearance, page)
{
  var url = "search/advanced?searchString=" +  query;
  if(minPrice !== null)
  {
    url = url + "&minPrice=" + minPrice;
  }

  if(maxPrice !== null)
  {
    url = url + "&maxPrice=" + maxPrice;
  }

  if(catagoryId != 0)
  {
    url = url + "&sectionNumber=" + catagoryId;
    if(getCatagoriesList().hasOwnProperty(catagoryId))
    {
      var catagoryName = getCatagoriesList()[catagoryId];
      url = url + "&sectionText=" + catagoryName;
    }
  }

  if(clearance)
  {
    url = url + "&isClearance=true"
  }

  if(page && page > 1)
  {
    var offset = ((page - 1) * productsPerPage) + 1;
    url = url + "&productOffset=" + offset;
  }

  return url;

}

function handleResponseFromSearch(response, clearance)
{
  var result =  JSON.parse(response);

  if(result.hasOwnProperty("error"))
  {
    if(result["error"].toUpperCase() === noResults.toUpperCase())
    {
      displayMessage("No results found.");
    }
  }
  else
  {
    if (!result.hasOwnProperty("totalNumProducts"))
    {
      if (!result.hasOwnProperty("productId"))
      {
        displayMessage("No results found.");
      }
      else {
        displayStockPage(result);
      }
    }
    else
    {
      if(clearance)
      {
        displayClearanceResultPage(result);
      }
      else
      {
        displaySearchResultPage(result);
      }
    }
  }
}
