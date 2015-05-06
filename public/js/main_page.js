function initPage()
{
  document.getElementById('search').addEventListener('submit', function() {searchBoxSubmit(this.childNodes[1].value)});

  try{
				var prmstr = window.location.search.substr(1);
				var prmarr = prmstr.split ("&");
				var params = {};

				for ( var i = 0; i < prmarr.length; i++) {
				    var tmparr = prmarr[i].split("=");
				    params[tmparr[0]] = tmparr[1];
				}

				if(params.search != null)
				{
          document.getElementById('searchBox').value = params.search;
          searchBoxSubmit(params.search)
				}
			}
			catch(err)
			{

			}
}

function searchBoxSubmit(searchQuery)
{
  event.preventDefault();
  searchByQuery(searchQuery);
  document.activeElement.blur();
}
