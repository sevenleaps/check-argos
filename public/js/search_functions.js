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

function advancedSearch (query, minPrice, maxPrice, catagoryId, clearance, storeId)
{
  if(minPrice === null && maxPrice === null && catagoryId == 0)
  {
    //no need for advanced search
    searchByQuery(query)
  }
  else
  {
    displaySpinner();
    var urlForAdvancedQuery = generatePushStateUrlForAdvancedSearch(query, minPrice, maxPrice, catagoryId, clearance, storeId);
    //TODO Populate this properly!
    if(navigator.userAgent.indexOf("MSIE 9.") > -1){
      //History not supported - Go to page
      if(location.search !== urlForAdvancedQuery){
        location.href = urlForAdvancedQuery;
      }
    }else{
      window.history.pushState(null, null, urlForAdvancedQuery);
    }
    searchViaAJAX(generateAdvancedSearchUrl(query, minPrice, maxPrice, catagoryId, clearance), clearance);
  }
}

function generatePushStateUrlForAdvancedSearch(query, minPrice, maxPrice, catagoryId, clearance, storeId)
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

  if(storeId)
  {
    url = url + "&storeId=" + storeId;
  }

  return url;
}

function generateAdvancedSearchUrl(query, minPrice, maxPrice, catagoryId, clearance)
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
      displayStockPage(result);
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
