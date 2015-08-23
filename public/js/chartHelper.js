
function initChart(json)
{
  var ctx = $("#myChart").get(0).getContext("2d");
  // This will get the first returned node in the jQuery collection.
  var chart = new Chart(ctx).Scatter(generateData(json), generateOptions());

}

function generateData(json)
{
  var da = new Array();
  for(var i = 0; i < json.length; i++) {
    var element = json[i];
    var source = new Object();
    source.y = element.price/100;
    source.x = moment(element.day.toString(), 'YYYYMMDD').toDate();
    da.push(source);
  }
  var data = [
    {
      label: 'Price History',
      strokeColor: '#F16220',
      pointColor: '#F16220',
      pointStrokeColor: '#fff',
      data: da
    }];

    return data;
}

function generateOptions()
{
  return {
				bezierCurve: false,
				showTooltips: true,
				scaleShowHorizontalLines: true,
				scaleShowLabels: true,
				scaleLabel: "€ <%=value%>",
				scaleArgLabel: "<%=value%>",
				scaleBeginAtZero: false,
        scaleType: "date",
        useUtc: true,
        scaleDateFormat: "d/m/yy",
        scaleDateTimeFormat: "d/m/yy"
			};
}
