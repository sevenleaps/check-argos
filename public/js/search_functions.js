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
