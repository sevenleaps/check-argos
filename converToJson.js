//Converter Class
var fs = require('fs');
var Converter = require('csvtojson').Converter;
var fileStream = fs.createReadStream('/Users/conor/repos/check-argos/argos_ie_365.csv');
//new converter instance
var converter = new Converter({constructResult:true});
//end_parsed will be emitted once parsing finished
converter.on('end_parsed', function (jsonObj) {
   console.log(jsonObj[0]); //here is your result json object
});
//read from file
fileStream.pipe(converter);
