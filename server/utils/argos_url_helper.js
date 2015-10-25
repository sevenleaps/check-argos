
module.exports = exports = {
  buildSubCatagorySearchUrl : buildSubCatagorySearchUrl,
  buildSearchUrl : buildSearchUrl
};

var productsPerPage = 40;
// http://www.argos.ie/static/Browse/c_1/1|category_root|Video games|14419738/c_2/2|14419738|Clearance+Video games|14419738/p/1/pp/80/r_001=2|Price|0+%3C%3D++%3C%3D+1000000|2/s/Price%3A+Low+-+High.htm
// http://www.argos.ie/static/Browse/c_1/1|category_root|".$sectionSelected.|".$sectionNumber[$sectionSelected]."/c_2/2|".$sectionNumber[$sectionSelected]."|Clearance+".$sectionSelected."|".$clearanceNumber[$sectionSelected]."/p/".$countProduct."/pp/".$productsPerPage."/r_001/4|Price|".$minPrice."+%3C%3D++%3C%3D+".$maxPrice."|2/s/".$searchPreference.".htm");
function buildSubCatagorySearchUrl(params) {
  var baseUrl = 'http://www.argos.ie/static/Browse/c_1/1%7Ccategory_root%7C';
  var url = baseUrl;
  var searchPreference = 'Price%3A+Low+-+High';
  url = url + params.sectionText + '|' + params.sectionNumber + '/c_2/2|' + params.sectionNumber  + '|' + params.subSectionText + '|' + params.subSectionNumber;

  var p = (params.productOffset) ? params.productOffset : 1;
  var pp = (params.productsPerPage) ? params.productsPerPage : productsPerPage;
  url = url + '/p/'+ p;
  url = url + '/pp/' + pp;

  params.minPrice = params.minPrice === undefined ? 0 : params.minPrice;
  params.maxPrice = params.maxPrice === undefined ? 1000000 : params.maxPrice;

  url = url + '/r_001/4|Price|' + params.minPrice + '+%3C%3D++%3C%3D+' + params.maxPrice + '|2';
  url = url + '/s/' + searchPreference + '.htm';

  return url.replace(/ /g, '+');
}

function buildSearchUrl(params) {
  var baseUrl = 'http://www.argos.ie/webapp/wcs/stores/servlet/Search';
  var url = baseUrl;

  //Adding required static params
  url = url + '?storeId=10152&langId=111';
  //Adding optional search parameters
  url = (params.searchString) ? url + '&q=' + params.searchString : url;
  var pp = (params.productsPerPage) ? params.productsPerPage : productsPerPage;
  url = url + '&pp=' + pp;
  url = (params.productOffset) ? url + '&p=' + params.productOffset : url;
  url = (params.sortType) ? url + '&s=' + params.sortType : url;
  url = (params.sectionText && params.sectionNumber) ? url + '&c_1=1|category_root|' + params.sectionText + '|' + params.sectionNumber : url;

  params.minPrice = params.minPrice === undefined ? 0 : params.minPrice;
  params.maxPrice = params.maxPrice === undefined ? 1000000 : params.maxPrice;

  url = url + '&r_001=2|Price|' + params.minPrice + '+%3C%3D++%3C%3D+' + params.maxPrice + '|2';

  return url.replace(/ /g, '+');

}
