function searchByQuery (searchQuery)
{
  window.history.pushState(null, null, '?search=' + searchQuery);
  searchByQueryNoHistory(searchQuery);
}

function searchByQueryNoHistory(searchQuery){
  displaySpinner();
  var myRequest = new XMLHttpRequest();
  myRequest.onload = function(){ handleResponseFromSearch(myRequest.response);};
  myRequest.open("GET", "search/simple?q=" +  searchQuery);
  myRequest.send();
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
    //TODO Populate this properly!
    window.history.pushState(null, null, generatePushStateUrlForAdvancedSearch(query, minPrice, maxPrice, catagoryId));
    var myRequest = new XMLHttpRequest();
    myRequest.onload = function(){ handleResponseFromSearch(myRequest.response);};
    myRequest.open("GET", generateAdvancedSearchUrl(query, minPrice, maxPrice, catagoryId));
    myRequest.send();
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
