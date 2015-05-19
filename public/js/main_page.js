function initPage()
{
  document.getElementById('searchBox').addEventListener('keypress', function(event) {
    if (!event){
      event = window.event;
    }
    var keyCode = event.keyCode || event.which;
    if (keyCode == '13'){
      // Enter pressed
      searchBoxSubmit(this.value);
    }
  });

  try{
    params = retrieveParams();

		if(params.search != null)
		{
      document.getElementById('searchBox').value = decodeURI(params.search);
      searchBoxSubmit(params.search)
		}
	}
	catch(err)
	{

	}
}

function displaySpinner()
{
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  var opts = {
    lines: 11, // The number of lines to draw
    length: 10, // The length of each line
    width: 10, // The line thickness
    radius: 15, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
  };

  var div = document.createElement('DIV');
  div.setAttribute("style", "text-align: center; height:8em");

  var spinner = new Spinner(opts).spin(div);

  resultsDiv.appendChild(div);
}

function displayMessage(message)
{
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  var div = document.createElement('DIV');
  div.setAttribute("style", "text-align: center;");

  var h = document.createElement("H3");
  h.innerHTML = message;

  div.appendChild(h);
  resultsDiv.appendChild(div);
}

function searchBoxSubmitWithReturnFalse(searchQuery)
{
  searchBoxSubmit(searchQuery);
  return false;
}

function searchBoxSubmit(searchQuery)
{
  //event.preventDefault();
  searchByQuery(searchQuery);
  document.activeElement.blur();
}

function manipulateHistory(event)
{
  if(!window.location.search){
    if(document.getElementById('results')){
      document.getElementById('searchBox').value = "";
      displayMessage("");
    }
  }else{
    params = retrieveParams();

    if(params.search != null)
    {
      document.getElementById('searchBox').value = decodeURI(params.search);
      searchByQueryNoHistory(params.search);
    }
  }
}

function retrieveParams(){
  var prmstr = window.location.search.substr(1);
  var prmarr = prmstr.split ("&");
  var params = {};

  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}

document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener('popstate', function(event) {
    manipulateHistory(event);
  });
});