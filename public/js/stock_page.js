function displayStockPage(item)
{
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  var row = document.createElement('DIV');
  row.setAttribute("class", "row");

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

  var h = document.createElement("H1");
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
  resultsDiv.appendChild(row);

}
