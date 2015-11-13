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

var REFFERL_LINK= 'http://www.qksrv.net/links/7708057/type/am/http://www.argos.ie/static/Product/partNumber/';

function showStoreSelector(event)
{
  event.preventDefault();
  $("#stockTableDiv").html("");
  loadStorePickerTemplate();
}

var currentCustomStoresCodes;

function setButtonEnabled()
{
  var button = $("#storeSaveButton");
  if(currentCustomStoresCodes && currentCustomStoresCodes.length > 0 && currentCustomStoresCodes.length <= 10)
  {
    button.removeClass("disabled");
  }
  else
  {
    button.addClass("disabled");
  }
}

function loadStorePickerTemplate()
{
  async1 =  $.ajax({//ajax call 1
    url:"/templates/store_selector.hjs"
  });

  async2 =  $.ajax({//ajax call 1
    url:"/templates/store_selector_section.hjs"
  });

  async3 = $.ajax({//ajax call 1
    url:"/assets/stores.json"
  });

  var customStores = getCustomStores();
  currentCustomStoresCodes = [];
  if(customStores){
    currentCustomStoresCodes = getCustomStores().map(function(store) {
      return store.code;
    });
  }

  var isStoreSelected = function(){
    //console.log(typeof this.value);
    return (jQuery.inArray(this.code, currentCustomStoresCodes) > -1);
  };
  var row = 0;
  var tableRowStart = function isOdd(){
    row++;
    return row % 2 === 1 ? '<tr>' : '';
  };
  var tableRowEnd = function isEven(){
    return row % 2 === 0 ? '</tr>' : '';
  };

  $.when(async3, async2, async1).done(function(stores, store_selector_section, store_selector) {

    var  view = {"isStoreSelected" : isStoreSelected,
                  "tableRowStart" : tableRowStart,
                  "tableRowEnd" : tableRowEnd,
                "stores": stores[0]};
    var partials = {
      "store_selector_section" : store_selector_section[0]
      };
    var storePicker = Mustache.render(store_selector[0], view, partials);
    $("#stockTableDiv").html(storePicker);
    $("#storeSaveButton").click(saveCustomStoresList);
    setButtonEnabled();
    $('input:checkbox').each(function ()
    {
      if($.inArray(this.value, currentCustomStoresCodes) > -1)
      {
        $(this).prop( "checked", true );
      }
    });
    $('input:checkbox').change(function () {
        var index = currentCustomStoresCodes.indexOf(this.value);
        if(this.checked)
        {
          if(index == -1)
          {
            currentCustomStoresCodes.push(this.value);
          }
        }
        else
        {
          if(index > -1)
          {
            currentCustomStoresCodes.splice(index, 1);
          }
        }

        setButtonEnabled();
       });
  });
}

function loadStoresTemplate(storeList, productId)
{
  referl = REFFERL_LINK + productId + '.htm';
  product = {
    productId : productId
  }

  var row = 0;
  var tableRowStart = function isOdd(){
    row++;
    return row % 2 === 1 ? '<tr>' : '';
  };
  var tableRowEnd = function isEven(){
    return row % 2 === 0 ? '</tr>' : '';
  };

  var product_store_info;
  var product_store_info_small;
  var product_store_table;


  async1 = $.ajax({//ajax call 1
    url:"/templates/product_store_info.hjs",
    success: function(data)
    {
      product_store_info = data;
    }
  });

  async2 =  $.ajax({//ajax call 1
    url:"/templates/product_store_info_small.hjs",
    success: function(data)
    {
      product_store_info_small = data;
    }
  });

  async3 = $.ajax({//ajax call 1
    url:"/templates/product_store_table.hjs",
    success: function(data)
    {
      product_store_table = data;
    }
  });

  $.when(async3, async2, async1).done(function(product_store_table, product_store_info_small, product_store_info) {

    var  view = {"referl" : referl,
                  "tableRowStart" : tableRowStart,
                  "tableRowEnd" : tableRowEnd,
                  "product" : product,
                "stores": storeList};
    var partials = {
      "product_store_info" : product_store_info[0],
      "product_store_info_small" : product_store_info_small[0]
      };
    var stockTable = Mustache.render(product_store_table[0], view, partials);
    $("#stockTableDiv").html(stockTable);
    $("#editStoreListLink").click(showStoreSelector);
  });

}

function getCustomStores()
{
  if(localStorage.customStoresJson)
  {
    //console.log(localStorage.customStoresJson);
    return JSON.parse(localStorage.customStoresJson);
  }
  else {
    return null;
  }

}

function saveCustomStoresList()
{

  if($(this).hasClass("disabled"))
  {
    return;
  }
  var customStoreObject = currentCustomStoresCodes.map(function(code) {
      var store = {
        code: code
      };

      store.name = $("#storeName" + code).html();

      return store;
    });

  customStoreObject.sort(function(a,b){return a.name.localeCompare(b.name);});
  setCustomStores(customStoreObject);
  $("#stockTableDiv").html("");
  loadStoresTemplate(customStoreObject, $("#productIdHidden").val());
}

function setCustomStores(storesList)
{
  localStorage.customStoresJson = JSON.stringify(storesList);
}

function getCustomStoreList()
{
  return [
    { "code" : 4101,
      "name" : "Arklow (Extra)"
    },
    { "code" : 943,
      "name" : "Ashbourne Retail Park"
    },
    { "code" : 262,
      "name" : "Athlone"
    }
  ];
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
