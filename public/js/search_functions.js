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

function searchViaAJAX(url){
  var myRequest = new XMLHttpRequest();
  myRequest.onload = function(){
    handleResponseFromSearch(myRequest.responseText);
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

function advancedSearch (query, minPrice, maxPrice, catagoryId)
{
  if(minPrice === null && maxPrice === null && catagoryId == 0)
  {
    //no need for advanced search
    searchByQuery(query)
  }
  else
  {
    displaySpinner();
    var urlForAdvancedQuery = generatePushStateUrlForAdvancedSearch(query, minPrice, maxPrice, catagoryId);
    //TODO Populate this properly!
    if(navigator.userAgent.indexOf("MSIE 9.") > -1){
      //History not supported - Go to page
      if(location.search !== urlForAdvancedQuery){
        location.href = urlForAdvancedQuery;
      }
    }else{
      window.history.pushState(null, null, urlForAdvancedQuery);
    }
    searchViaAJAX(generateAdvancedSearchUrl(query, minPrice, maxPrice, catagoryId));
  }
}

function generatePushStateUrlForAdvancedSearch(query, minPrice, maxPrice, catagoryId)
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

  return url;
}

function generateAdvancedSearchUrl(query, minPrice, maxPrice, catagoryId)
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

  return url;

}

function handleResponseFromSearch(response)
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
    if (!Array.isArray(result))
    {
      displayStockPage(result);
    }
    else
    {
      displaySearchResultPage(result);
    }
  }
}
