function displaySearchResultPage(items)
{
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  generateSearchResultsTable(items, resultsDiv);

  // for (var i =0; i < items.length; i++ )
  // {
  //   var row = document.createElement('DIV');
  //   row.setAttribute("class", "row");
  //   row.setAttribute("style", "padding-bottom: 1em; border-bottom:solid 1px rgba(0, 0, 0, 0.1)");
  //   row.innerHTML = '<img style="width:110px!important" src="' + items[i].productImageUrl + '" alt="" />' +  '<h1>' + items[i].productName + '</h1>';
  //
  //   resultsDiv.appendChild(row);
  // }
}

function generateSearchResultsTable(items, resultsDiv)
{
  var table = document.createElement("TABLE");
  table.setAttribute("class", "default");

  var headerRow = document.createElement('tr');
  headerRow.setAttribute("style", "padding-bottom: 1em; border-bottom:solid 1px rgba(0, 0, 0, 0.1)");

  var thead = document.createElement('thead');
  var imageHeaderCell = document.createElement("th");
  imageHeaderCell.innerHTML = "";
  var nameHeaderCell = document.createElement("th");
  nameHeaderCell.innerHTML = "Product Name";
  var priceSavingHeaderCell = document.createElement("th");
  priceSavingHeaderCell.setAttribute("class", "hideCellOnMobile");
  priceSavingHeaderCell.setAttribute("style", "text-align: center;");
  priceSavingHeaderCell.innerHTML = "% Saving";
  var priceHeaderCell = document.createElement("th");
  priceHeaderCell.setAttribute("style", "text-align: center;");
  priceHeaderCell.innerHTML = "Price (€)";

  headerRow.appendChild(imageHeaderCell);
  headerRow.appendChild(nameHeaderCell);
  headerRow.appendChild(priceSavingHeaderCell);
  headerRow.appendChild(priceHeaderCell);

  //thead.appendChild(headerRow);
  table.appendChild(headerRow);

  var tbody = document.createElement('tbody');

  for (var i =0; i < items.length; i++ )
  {

    var item = items[i];
    var row = document.createElement('tr');
    row.setAttribute("style", "padding-bottom: 1em; border-bottom:solid 1px rgba(0, 0, 0, 0.1)");

    var itemImageCell = document.createElement("td");
    var img = new Image();
    img.src = item.productImageUrl;
    img.setAttribute("class", "itemProductImage");
    itemImageCell.appendChild(img);

    var itemNameCell = document.createElement("td");
    itemNameCell.setAttribute("style", "vertical-align:middle;");

    var productId = item.productId.replace("/", "");
    var productUrl = "?search=" + productId;
    var nameATag = document.createElement('a');
    nameATag.setAttribute('href',productUrl);
    nameATag.onclick = (function(tmpProductId) {
        return function()
        {
          return searchBoxSubmitWithReturnFalse(tmpProductId);
        };
      })(productId);

    nameATag.innerHTML = item.productName;
    itemNameCell.appendChild(nameATag);

    var precentageSaving = 0;
    if(item.previousPrice != 0)
    {
      precentageSaving = ((1 - (item.price/item.previousPrice))* 100).toFixed(0);
    }

    var itemPriceSavingCell = document.createElement("td");
    itemPriceSavingCell.setAttribute("style", "vertical-align:middle; text-align: center");
    itemPriceSavingCell.setAttribute("class", "hideCellOnMobile");
    itemPriceSavingCell.innerHTML = precentageSaving;

    var itemPriceCell = document.createElement("td");
    itemPriceCell.setAttribute("style", "vertical-align:middle; text-align: center");
    itemPriceCell.innerHTML = item.price;

    row.appendChild(itemImageCell);
    row.appendChild(itemNameCell);
    row.appendChild(itemPriceSavingCell);
    row.appendChild(itemPriceCell);

    table.appendChild(row);
  }

  //table.appendChild(tbody);
  resultsDiv.appendChild(table);
}
