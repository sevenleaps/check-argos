function generateStoreDropDown()
{
  var select = document.createElement("select");
  select.setAttribute("class", "form-control");
  var option = document.createElement("option");
  option.text = "-- Check store for Stock --";
  option.value = 0;
  select.add(option);

  var storeList = getStoreList();
  for(var key in storeList)
  {
    var option = document.createElement("option");
    option.text = key;
    option.value = storeList[key];
    select.add(option);
  }

  select.selectedIndex = 0;

  return select;
}


function loadStoresTemplate(storeList, productId)
{
  referl = "http://somelink.com";
  product = {
    productId : productId
  }
  var product_store_info = $('/templates/product_store_info.hjs').html();
  var product_store_info_small = $('/templates/product_store_info_small.hjs').html();

  var  view = {"name" : "You"},
    partials = {"li-templ": li},
    ul1 = Mustache.render($('#ul-template').html(), view, partials),
    ul2 = Mustache.render($('#ul-template2').html(), view, partials);;
}

function getStoreList()
{
  return stores;
}

var stores = {
          "Argos on eBay ROI (Extra)" : 4270,
          "Arklow (Extra)" : 4101,
					"Ashbourne Retail Park" : 943,
					"Athlone" : 262,
					"Blanchardstown West End" : 669,
					"Carlow (Extra)" : 4130,
					"Castlebar" : 807,
					"Cavan (Extra)" : 814,
					"Clonmel (Extra)" : 4214,
					"Cork Mahon (Extra)" : 4113,
					"Cork Queens Old Castle" : 45,
					"Cork Retail Park" : 801,
					"Drogheda (Extra)" : 875,
					"Dun Laoghaire" : 200,
					"Dundalk Retail Park (Extra)" : 931,
					"Dundrum" : 817,
					"Galway" : 547,
					"Ilac Centre Dublin" : 394,
					"Jervis Street Dublin" : 397,
					"Kilkenny" : 201,
					"Killarney (Extra)" : 899,
					"Letterkenny (Extra)" : 793,
					"Liffey Valley (Extra)" : 687,
					"Limerick Childers Road (Extra)" : 915,
					"Limerick Cruises Street" : 393,
					"Limerick The Crescent" : 583,
					"Longford (Extra)" : 880,
					"Monaghan (Extra)" : 945,
					"Naas (Extra)" : 4218,
					"Navan" : 832,
					"Nutgrove" : 392,
					"Omni Park Dublin (Extra)" : 4150,
					"Portlaoise (Extra)" : 4125,
					"Sligo (Extra)" : 4146,
					"St Stephens Green Dublin" : 584,
					"Swords (Extra)" : 581,
					"Tallaght" : 395,
					"Tralee (Extra)" : 11,
					"Tullamore (Extra)" : 879,
					"Waterford" : 396,
					"Wexford (Extra)" : 826,
           "eBay Outlet In ROI (Extra)" : 4271
        };
