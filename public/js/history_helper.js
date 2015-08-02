function removeParameterFromUrl(url, param)
{
  var re = new RegExp(param + "\??=[^&]*&?", "");
  return url.replace(re, '');
}

function removeParamFromHref(param)
{
  var url = getUrl();
  window.history.pushState(null, null, removeParameterFromUrl(url, param));
}

function updateParameter(param, value)
{
  var url = getUrl();
  if((url.indexOf(param+"=") > -1))
  {
    url = removeParameterFromUrl(url, param);
  }

  if(url.charAt(url.length - 1) != "?")
  {
    url = url + "&";
  }

  //need to finish..
}

function getUrl()
{
  return top.location.href;
}
