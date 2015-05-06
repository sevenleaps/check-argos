function displayStockPage(item)
{
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  resultsDiv.appendChild(generateProductInfoRow(item));

  generateStockInfo(item, resultsDiv);

  checkStockForAllStores(item);

}

function checkStockForAllStores(item)
{
  var productId = item.productId.replace("/", "");

  for(var key in stores)
  {
    if (stores.hasOwnProperty(key))
    {
      checkStockForSingleStore(productId, stores[key]);
    }
  }
}

function checkStockForSingleStore(productId, storeId)
{

  var pos = -1;
	for (var i=0; i<xmlreqs.length; i++)
	{
		if (xmlreqs[i].freed == 1)
		{
		pos = i; break;
		}
	}
	if (pos == -1)
	{
		pos = xmlreqs.length; xmlreqs[pos] = new CXMLReq(1);
	}
	if (xmlreqs[pos].xmlhttp)
	{
		xmlreqs[pos].freed = 0;
		xmlreqs[pos].xmlhttp.open("GET", "stockcheck/" + storeId + "/" + productId, true);
		xmlreqs[pos].xmlhttp.onload = function()
		{
				processStockChange(pos, storeId);
		}

		xmlreqs[pos].xmlhttp.send();
	}

}

function processStockChange(pos, storeId)
{
	if (typeof(xmlreqs[pos]) != 'undefined' && xmlreqs[pos].freed == 0 && xmlreqs[pos].xmlhttp.readyState == 4)
	{
		if (xmlreqs[pos].xmlhttp.status == 200 || xmlreqs[pos].xmlhttp.status == 304)
		{
			var elementId = "status";
      var result =  JSON.parse(xmlreqs[pos].xmlhttp.responseText);

			if (result.isStocked)
			{
        document.getElementById("store" + storeId).innerHTML = result.stockQuantity + " in stock."
			}
			else if (result.isOrderable)
			{
        document.getElementById("store" + storeId).innerHTML = "Can be ordered.";
			}
			else if (result.hasOutOfStockMessage)
			{
        document.getElementById("store" + storeId).innerHTML = "Out of Stock.";
			}
      else
      {
        document.getElementById("store" + storeId).innerHTML = "Unknown status.";
      }

		}

		xmlreqs[pos].freed = 1;
	}
}

function generateStockInfo(item, resultsDiv)
{
  var leftStoreDiv = null;
  var rightStoreDiv = null;

  for(var key in stores)
  {
    if (stores.hasOwnProperty(key))
    {
      if(leftStoreDiv == null)
      {
        leftStoreDiv = generateStoreDiv(key, stores[key]);
      }
      else
      {
        rightStoreDiv = generateStoreDiv(key, stores[key]);
        resultsDiv.appendChild(generateStockInfoRow(leftStoreDiv, rightStoreDiv));
        leftStoreDiv = null;
        rightStoreDiv = null;
      }

    }
  }

  if(leftStoreDiv != null)
  {
    resultsDiv.appendChild(generateStockInfoRow(leftStoreDiv, rightStoreDiv));
  }
}

function generateStockInfoRow(leftStoreDiv, rightStoreDiv)
{
  var row = document.createElement('DIV');
  row.setAttribute("class", "row");

  row.appendChild(leftStoreDiv);
  if(rightStoreDiv != null)
  {
    row.appendChild(rightStoreDiv);
  }

  return row;
}

function generateStoreDiv(storeName, storeId)
{
  var storeDiv = document.createElement('DIV');
  storeDiv.setAttribute("class", "6u");
  storeDiv.setAttribute("style", "text-align: center;");
  //storeDiv.setAttribute("id", "store" + storeId);

  storeDiv.innerHTML = storeName + ' : <span id="store' + storeId + '">Checking...</span>';

  return storeDiv;

}

function generateProductInfoRow(item)
{
  var row = document.createElement('DIV');
  row.setAttribute("class", "row");
  row.setAttribute("style", "border-bottom:solid 1px rgba(0, 0, 0, 0.1); padding-bottom:1em;");

  var imageDiv = document.createElement('DIV');
  imageDiv.setAttribute("class", "6u");
  imageDiv.setAttribute("style", "text-align: center;");
  var img = new Image();
  img.src = item.productImageUrl;
  imageDiv.appendChild(img);

  var productInfoDiv = document.createElement('DIV');
  productInfoDiv.setAttribute("class", "6u");
  productInfoDiv.setAttribute("style", "text-align: center;");


  var productId = item.productId.replace("/", "");
  var productUrl = "http://www.argos.ie/static/Product/partNumber/" + productId +".htm";

  var h = document.createElement("H3");
  var titleATag = document.createElement('a');
  titleATag.setAttribute('href',productUrl);
  titleATag.innerHTML = item.productName;
  h.appendChild(titleATag);



  var priceATag = document.createElement('a');
  priceATag.setAttribute('href',productUrl);
  priceATag.innerHTML = "Buy at Argos.ie - €" + item.price;

  productInfoDiv.appendChild(h);
  productInfoDiv.appendChild(priceATag);

  row.appendChild(imageDiv);
  row.appendChild(productInfoDiv);

  return row;
}

var xmlreqs = new Array();

function CXMLReq(freed)
{
	this.freed = freed;
	this.xmlhttp = false;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		this.xmlhttp=new XMLHttpRequest();
	}
	else
	{
		this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
}



var stores = {
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
					"Wexford (Extra)" : 826
        };
