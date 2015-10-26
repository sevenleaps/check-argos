module.exports = exports = {
  getSelectedFunction : getSelectedFunction,
  populateRenderParamsWithAdvancedSearch : populateRenderParamsWithAdvancedSearch
};

function getSelectedFunction(selected)
{
  return function(){
    if (this.code==selected) return "selected";
    return "";
  };
}

function populateRenderParamsWithAdvancedSearch(renderParams, inputs, formAction, disableButton, buttonText)
{
  var stores = require('../assets/stores.json');
  var catagories = require('../assets/catagories.json');

  if(!buttonText)
  {
    buttonText = "Search";
  }

  var sectionNumber;
  var store;
  if(inputs.sectionNumber)
  {
    sectionNumber = inputs.sectionNumber;
  }

  if(inputs.store)
  {
    store = inputs.store;
  }

  renderParams.storeList = stores;
  renderParams.catagoryList = catagories;
  renderParams.selectedCatagory = getSelectedFunction(sectionNumber);
  renderParams.selectedStore = getSelectedFunction(store);
  renderParams.inputs = inputs;
  renderParams.advancedSearchFilter = {
    formAction : formAction,
    disableButton: disableButton,
    buttonText: buttonText
  };

  return renderParams;
}
