var isClearancePage = false;
var currentPage = 1;
var itemsList = null;

var storeDropDownId = "storeDropDown";
var catagoriesDropDownId = "catagoriesDropDown";
var minPriceId = "minPriceInput";
var maxPriceId = "maxPriceInput";

function isValidItemData(itemJson)
{
  if(itemJson.price === ".")
  {
    return false;
  }

  return true;
}

function onStoreDropDownChange(storeId){
  restoreStockFilterOfItems();
  var itemList = document.getElementsByClassName("product-id");
  if(storeId != 0 && itemList.length > 0){
    updateStockColumnVisilbity(true);
    for(var i = 0; i < itemList.length; i++){
      var itemPrice = itemList[i].getElementsByClassName("product-price");
      if(itemPrice[0].innerHTML !== "."){
        var productId = itemList[i].id.replace("productId", "");
        var element = document.getElementById("stockStatus" + productId);
        element.innerHTML = "";
        filterSearchRowByStockStatus(productId, storeId, true);
      }
    }
  }
  else
  {
    updateStockColumnVisilbity(false);
  }
}

function onStoreSelectChange()
{
  var storeDropDown = document.getElementById(storeDropDownId);
  var storeId = storeDropDown.options[storeDropDown.selectedIndex].value;

  restoreStockFilterOfItems();

  if(storeId != 0 && itemsList != null)
  {
    updateStockColumnVisilbity(true);
    for(var i =0; i < itemsList.length; i++ )
    {
      var item = itemsList[i];
      if(isValidItemData(item))
      {
        var productId = item.productId.replace("/", "");
        filterSearchRowByStockStatus(productId, storeId, false);
      }
    }
  }
  else
  {
    updateStockColumnVisilbity(false);
  }
}

function restoreStockFilterOfItems()
{
  if(itemsList != null)
  {
    for(var i =0; i < itemsList.length; i++ )
    {
      var item = itemsList[i];
      if(isValidItemData(item))
      {
        var productId = item.productId.replace("/", "");
        var element = document.getElementById("stockStatus" + productId);
        element.innerHTML = "";
      }
    }
  }
}

function updateStockColumnVisilbity(visible)
{
  var columnElements = document.getElementsByName("stockStatusColumn");
  for(var i =0; i < columnElements.length; i++ )
  {
      var elem = columnElements[i];
      if(visible)
      {
        elem.setAttribute("class", "");
      }
      else
      {
        elem.setAttribute("class", "hide");
      }
  }
}

function resetStockStatusForProduct(productId)
{
  document.getElementById("stockStatus" + productId) && addSpinnerToStockStatus(document.getElementById("stockStatus" + productId));
}

function handleItemRowsStockResponse(itemJson, storeId, isPopular) {
  var element = document.getElementById("stockStatus" + itemJson.productId);
  element && appendStockStatus(itemJson, element, function(){
    resetStockStatusForProduct(itemJson.productId);
    checkStockForSingleStore(itemJson.productId, storeId);
  }, true, isPopular);
}
