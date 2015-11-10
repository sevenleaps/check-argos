function addSpinnerToStockStatus(element)
{
  element.innerHTML = '';
  var icon = document.createElement('i');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('class', 'fa fa-spinner fa-pulse');
  element.appendChild(icon);
}

function appendStockStatusCommon(itemJson, element, retryFunction, smallStatusOnly) {
  element.innerHTML = '';
  var icon = document.createElement('i');
  icon.setAttribute('aria-hidden', 'true');

  var textSpan = document.createElement('span');
  var mobileTextSpan = document.createElement('span');

  if(smallStatusOnly){
    textSpan.setAttribute('class', 'hidden');
  }
  else {
    textSpan.setAttribute('class', 'hidden-xs');
    mobileTextSpan.setAttribute('class', 'custom-xs');
  }

  if (itemJson.isStocked)
  {
    icon.setAttribute('class', 'fa fa-check');
    icon.setAttribute('style', 'color: green;font-size: 20px;');
    textSpan.setAttribute('style', 'color: green;padding-left:1em; vertical-align: top;');
    textSpan.innerHTML = itemJson.stockQuantity + ' in stock';
    mobileTextSpan.setAttribute('style', 'color: green;padding-left:1em; vertical-align: top;');
    mobileTextSpan.innerHTML = itemJson.stockQuantity;
  }
  else if (itemJson.isOrderable)
  {
    icon.setAttribute('class', 'fa fa-truck');
    icon.setAttribute('style', 'color: orange;font-size: 20px;');
    textSpan.setAttribute('style', 'color: orange;padding-left:1em; vertical-align: top;');
    textSpan.innerHTML = 'Orderable';
  }
  else if (itemJson.hasOutOfStockMessage)
  {
    icon.setAttribute('class', 'fa fa-close');
    icon.setAttribute('style', 'color: red;font-size: 20px;');
    textSpan.setAttribute('style', 'color: red;padding-left:1em; vertical-align: top;');
    textSpan.innerHTML = 'Out of stock';
  }
  else
  {
    icon.setAttribute('class', 'fa fa-question');
    icon.setAttribute('style', 'color: red;font-size: 20px;');

    var retryButton = document.createElement("button");
    retryButton.setAttribute("class", "btn btn-default btn-xs");
    retryButton.setAttribute('style', 'margin-left: 2em;');
    retryButton.onclick = retryFunction;
    retryButton.innerHTML = "Retry";
    textSpan.appendChild(retryButton);

    var retryButtonMobile = document.createElement("button");
    retryButtonMobile.setAttribute("class", "btn btn-default btn-xs");
    retryButtonMobile.setAttribute('style', 'margin-left: 1em;');
    retryButtonMobile.onclick = retryFunction;

    var retryIcon = document.createElement('i');
    retryIcon.setAttribute('aria-hidden', 'true');
    retryIcon.setAttribute('class', 'fa fa-refresh');

    retryButtonMobile.appendChild(retryIcon);

    mobileTextSpan.appendChild(retryButtonMobile);


  }

  element.appendChild(icon);
  element.appendChild(textSpan);
  element.appendChild(mobileTextSpan);
}
