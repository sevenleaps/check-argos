function initPage()
{
  document.getElementById('search').addEventListener('submit', function() {searchBoxSubmit(this.childNodes[1].value)});
}

function searchBoxSubmit(searchQuery)
{
  event.preventDefault();
  searchByQuery(searchQuery);
  document.activeElement.blur();
}
