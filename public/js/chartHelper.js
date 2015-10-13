
function initChart(json) {
  var ctx = $('#myChart').get(0).getContext('2d');
  // This will get the first returned node in the jQuery collection.
  var chart = new Chart(ctx).Scatter(generateData(json), generateOptions());

}

function generateData(prices) {
  var dataPoints = prices.filter(function (price)
  {
    return !((price.price === 0) || (price.price === null)) ;
  }).map(function (price) {
    var source = {};
    source.y = price.price/100;
    source.x = moment(price.day.toString(), 'YYYYMMDD').toDate();
    return source;
  });

  dataPoints = dataPoints.map(function (source, index, array) {
    var sources = [source];
    // if last element
    if (array[index + 1] === undefined) {
    } else {
      var isDayApart = array[index + 1].x.getTime() - source.x.getTime() > 86400000;

      if (isDayApart) {
        var padSource = {};
        padSource.y = source.y;
        padSource.x = moment(array[index + 1].x).subtract(1, 'day').toDate();
        sources.push(padSource);
      }
    }
    return sources;
  });

  dataPoints = _.flatten(dataPoints);
  var last = dataPoints.pop();
  var today = {
    y: last.y,
    x: moment().toDate()
  };
  dataPoints.push(last);
  dataPoints.push(today);

  var data = [
    {
      label: 'Price History',
      strokeColor: '#F16220',
      pointColor: '#F16220',
      pointStrokeColor: '#fff',
      data: dataPoints
    }];

    return data;
}

function generateOptions()
{
  return {
        datasetStroke: true,
				bezierCurve: false,
				showTooltips: true,
				scaleShowHorizontalLines: true,
				scaleShowLabels: true,
				scaleLabel: '€ <%=value%>',
				scaleArgLabel: '<%=value%>',
				scaleBeginAtZero: false,
        scaleType: 'date',
        useUtc: true,
        scaleDateFormat: 'mmm yy',
        scaleDateTimeFormat: 'dd mmm yy'
			};
}
