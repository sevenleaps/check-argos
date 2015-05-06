function searchByQuery (searchQuery)
{
  window.history.pushState(null, null, '?search=' + searchQuery);
  var myRequest = new XMLHttpRequest();
  myRequest.onload = function(){ handleResponseFromSearch(myRequest.response);};
  myRequest.open("GET", "search/simple?q=" +  searchQuery);
  myRequest.send();
}

function handleResponseFromSearch(response)
{
  var result =  JSON.parse(response);
  if (!Array.isArray(result))
  {
    displayStockPage(result);
  }
  else
  {
    displaySearchResultPage(result);
  }
}
