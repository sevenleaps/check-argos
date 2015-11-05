function generateCatagoriesDropDown(defaultOptionText)
{
  if (defaultOptionText === undefined) defaultOptionText = "-- All Sections --";
  var select = document.createElement("select");
  select.setAttribute("class", "form-control");

  var option = document.createElement("option");
  option.text = defaultOptionText;
  option.value = 0;
  select.add(option);

  var catagoriesList = getCatagoriesList();
  for(var key in catagoriesList)
  {
    var option = document.createElement("option");

    var cleanedUpText = catagoriesList[key].replace(/\+/g, ' ').replace(/\%2C/g, ',');
    option.text = cleanedUpText;
    option.value = key;
    select.add(option);
  }

  select.selectedIndex = 0;

  return select;
}


function getCatagoriesList()
{
  return catagories;
}

var catagories = {
  14418476 :"Kitchen+and+laundry",
  14417894 : "Home+and+furniture",
  14418702 : "Garden+and+DIY",
  14419152 : "Sports+and+leisure",
  14418350 : "Health+and+personal+care",
  14419512 : "Home+entertainment+and+sat+nav",
  14419738 : "Video+games",
  14419436 : "Photography",
  14418968 : "Office%2C+PCs+and+phones",
  14417629 : "Toys+and+games",
  14417537 : "Nursery",
  14416987 : "Jewellery+and+watches",
  14417351 : "Gifts"
        };

function updateHiddenSearch(value){
  var hiddenInput = document.getElementById("updateHiddenSearch");
  if(hiddenInput !== null){
    hiddenInput.value = value;
  }
}