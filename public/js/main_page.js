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

  // $('body').css('min-height',$(document).height() + $('#searchBox').offset().top);
  //
  // $('#searchBox').on('focus', function() {
  //   document.body.scrollTop = $(this).offset().top;
  // });

  try{
    params = retrieveParams();

		if(params.search != null)
		{
      populateSearchBox(decodeURI(params.search));

      var minPrice = (params.minPrice != null || params.minPrice != undefined) ? params.minPrice : null;
      var maxPrice = (params.maxPrice != null || params.maxPrice != undefined) ? params.maxPrice : null;
      var catagoryId = (params.catagoryId != null || params.catagoryId != undefined) ? params.catagoryId : 0;
      var clearance = (params.catagoryId != null || params.catagoryId != undefined);
      //will default to a simple search if needed
      advancedSearch (params.search, minPrice, maxPrice, catagoryId, clearance);
      hideHomeScreen();

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
  ga('send', 'event', 'box', 'searched', searchQuery);
  searchBoxSubmit(searchQuery);
  return false;
}

function searchBoxSubmit(searchQuery)
{
  //event.preventDefault();
  populateSearchBox(searchQuery);
  hideHomeScreen();
  searchByQuery(searchQuery);
  document.activeElement.blur();
}

function manipulateHistory(event)
{
  if(!window.location.search){
    if(document.getElementById('results')){
      populateSearchBox("");
      displayMessage("");
    }
  }else{
    params = retrieveParams();

    if(params.search !== null)
    {
      populateSearchBox(decodeURI(params.search));
      searchByQueryNoHistory(params.search);
    }
  }
}

function populateSearchBox(value)
{
  $('input[name=search]').each(function(){
    $(this).val(value);
  });
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

function scrollToSearchBar()
{
  $('html, body').animate({
        scrollTop: $("#searchBox").offset().top
    }, 2000);
}

function hideHomeScreen(){
  $( "#homeScreen" ).addClass( "hidden" );
  $( "#navbarSearchForm" ).removeClass( "hidden" );
}

function showHomeScreen(){
  $( "#homeScreen" ).removeClass( "hidden" );
  $( "#navbarSearchForm" ).addClass( "hidden" );
  $( "#results" ).html("");
  populateSearchBox("");

  if(navigator.userAgent.indexOf("MSIE 9.") > -1){
    //History not supported - Go to page
    //location.href = url;
    return true;
  }else{
    window.history.pushState(null, null, "/");
    return false;
  }

}

document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener('popstate', function(event) {
    manipulateHistory(event);
  });
});
