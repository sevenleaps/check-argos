function displaySearchResultPage(items)
{
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";


  for (var i =0; i < items.length; i++ )
  {
    var row = document.createElement('DIV');
    row.setAttribute("class", "row");
    row.setAttribute("style", "border-bottom:solid 1px rgba(0, 0, 0, 0.1)");
    row.innerHTML = '<img style="width:110px!important" src="' + items[i].productImageUrl + '" alt="" />' +  '<h1>' + items[i].productName + '</h1>';

    resultsDiv.appendChild(row);
  }
}
