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
      var result =  JSON.parse(xmlreqs[pos].xmlhttp.responseText);
      handleStoreStockStatus(result, storeId);
		}

		xmlreqs[pos].freed = 1;
	}
}

function filterSearchRowByStockStatus(productId, storeId)
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
      handleFilterRowResponse(pos, storeId, productId);
    }

    xmlreqs[pos].xmlhttp.send();
	}
}

function handleFilterRowResponse(pos, storeId, productId)
{
	if (typeof(xmlreqs[pos]) != 'undefined' && xmlreqs[pos].freed == 0 && xmlreqs[pos].xmlhttp.readyState == 4)
	{
		if (xmlreqs[pos].xmlhttp.status == 200 || xmlreqs[pos].xmlhttp.status == 304)
		{
      var result =  JSON.parse(xmlreqs[pos].xmlhttp.responseText);
      handleItemRowsStockResponse(result)
		}

		xmlreqs[pos].freed = 1;
	}
}
