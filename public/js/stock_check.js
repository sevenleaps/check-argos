function addSpinnerToStockStatus(element)
{
  element.innerHTML = '';
  var icon = document.createElement('i');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('class', 'fa fa-spinner fa-pulse');
  element.appendChild(icon);
}

function appendStockStatus(itemJson, element, retryFunction, smallVersion, isPopular) {
  element.innerHTML = '';
  var icon = document.createElement('i');
  icon.setAttribute('aria-hidden', 'true');

  var textSpan = document.createElement('span');

  if (itemJson.isStocked) {
    icon.setAttribute('class', 'fa fa-check');
    icon.setAttribute('style', 'color: green;font-size: 20px; float:right;');
    textSpan.setAttribute('style', 'float:right; color: green;padding-left:1em; padding-right:1em; vertical-align: top;');

    textSpan.innerHTML = itemJson.stockQuantity;

  } else if (itemJson.isOrderable) {
    icon.setAttribute('class', 'fa fa-truck');
    icon.setAttribute('style', 'color: orange;font-size: 20px;');
    if(!smallVersion)
    {
      textSpan.setAttribute('style', 'color: orange;padding-right:1em; vertical-align: top;');
      textSpan.innerHTML = 'Orderable';
    }
  } else if (itemJson.hasOutOfStockMessage) {
    $('#swagnote').show();
    icon.setAttribute('style', 'color: red;font-size: 20px;');
    var zero = document.createElement('span');
    zero.setAttribute('style', 'color: red;padding-left:1em; padding-right:1em; vertical-align: top;');
    zero.innerHTML = '0';

    var button = document.createElement('button');
    button.onclick = function (event) {addStockTracker(itemJson.storeId, inverseStores[itemJson.storeId], event)}
    button.setAttribute('style', 'border-width: 0px; font-size: smaller');
    button.setAttribute('class', ' btn btn-success swawk-stock');
    button.innerText = 'Track stock';


    var div = document.createElement('div');
    div.setAttribute('style', 'float: right');
    isPopular || div.appendChild(button);
    div.appendChild(zero);

    textSpan = div;
  }
  else
  {
    icon.setAttribute('class', 'fa fa-question');
    icon.setAttribute('style', 'color: red; padding-left:1em; font-size: 20px;');

    var retryButton = document.createElement("button");

    if(!smallVersion){
      retryButton.setAttribute("class", "btn btn-default btn-xs");
      retryButton.setAttribute('style', 'margin-left: 2em;');
      retryButton.onclick = retryFunction;
      retryButton.innerHTML = "Retry";
    }
    else {
      retryButton.setAttribute("class", "btn btn-default btn-xs");
      retryButton.setAttribute('style', 'margin-left: 0.6em;');
      retryButton.onclick = retryFunction;

      var retryIcon = document.createElement('i');
      retryIcon.setAttribute('aria-hidden', 'true');
      retryIcon.setAttribute('class', 'fa fa-refresh');

      retryButton.appendChild(retryIcon);
    }

    textSpan.appendChild(retryButton);

  }

  element.appendChild(textSpan);
  element.appendChild(icon);
}
