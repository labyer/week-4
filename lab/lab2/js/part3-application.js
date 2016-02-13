/* =====================
  Lab 2, part3: a full application

  We're going to use the skills we've just been practicing to write a full application which is responsive to user input. At your disposal are a set of global variables which track user input (see part3-main.js and part3-setup.js for more details on how this is done — we'll cover this topic at a later date). Their values will be logged to console to aid in debugging.

  In this lab, which is very much open-ended, your task is to use the value of these variables to define the functions below. Try to come up with interesting uses of the provided user input.

  Some ideas:
    There are two numeric fields: can you write this application so as to filter using both minimum and maximum?
    There is a boolean field: can you write your code to filter according to this boolean? (Try to think about how you could chop your data to make this meaningful.)
    There is a string field: can you write your code to filter/search based on user input?

  Remember, this is open-ended. Try to see what you can produce.
===================== */




/* =====================
  Define a resetMap function to remove markers from the map and clear the array of markers
===================== */

var resetMap = function(data) {
  return _.each(data, function(i){
    map.removeLayer(i);
  });
};

/* =====================
  Define a getAndParseData function to grab our dataset through a jQuery.ajax call ($.ajax). It will be called as soon as the application starts. Be sure to parse your data once you've pulled it down!
===================== */

var downloadData = $.ajax("https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-bike-crashes-snippet.json");
//console.log(downloadData);

var getAndParseData = function(data) {
  return JSON.parse(data);
};



/*=====================
Clean Data - POLICE_AGC to string
=======================*/

var addStationString = function(data){
  return _.map(data, function(i){
    //add a new key to each object that is a string of the value in the POLICE_AGC key, in order to convert them all to strings
    i.POLICE_STATION = i.POLICE_AGC.toString();
    return i;
  });
};



/*=====================
Numberic Filter
=======================*/

var numericFilter = function(data){
  return _.filter(data, function(i){
    return i.DATE_OF_MO >= numericField1 && i.DATE_OF_MO <= numericField2;
  });
};

/*=====================
String Filter
=======================*/

var stringFilter = function(data){
  return _.filter(data, function(i){
    //if the user does not specify a station, then return all crashes that meet all specified criteria that are served by any station
    if ($('#station').val() === ''){
      return i.POLICE_STATION;
    }
    //if the user does specify a station, return only the crashed that involved that station
    else {
      return i.POLICE_STATION === stringField;
      //return i.POLICE_AGC === '68K01';
    }
  });
};

/*=====================
Boolean Filter
=======================*/

var booleanFilter = function(data){
  return _.filter(data, function(i){
    if ($('#boolean')[0].checked) {
      //if the user checks the box, return the locations that also experienced property damage
      return i.PROPERTY_D === 1;
    }
    else {
      //if the user does not check the box, return the locations that did or did not experienced property damage
      return i.PROPERTY_D === 1 || i.PROPERTY_D === 0;
    }
  });
};



/* =====================
  Call our plotData function. It should plot all the markers that meet our criteria (whatever that criteria happens to be — that's entirely up to you)
===================== */

var makeMarkers = function(data) {
  return _.map(data, function(i){
    return L.marker([i.LAT, i.LNG]);
  });
};

var plotData = function(data) {
  return _.each(data, function(i){
    i.addTo(map);
  });
};


/*=====================
Run
=======================*/


function whichButton(buttonElement){
  //alert(buttonElement.id);
  var buttonClickedId = buttonElement.id;
  if( buttonClickedId === 'plot-button' ){
    numericField1 = $('#num1').val();
    console.log("Month 1:", numericField1);
    numericField2 = $('#num2').val();
    console.log("Month 2:", numericField2);
    booleanField = $('#boolean')[0].checked;
    console.log("Did you ask to see only crashes involving property damage?:", booleanField);
    stringField = $('#station').val();
    console.log("Police Station:", stringField);
    //resetMap();
    //plotData();
    downloadData.done(function(data) {
      var parsed = getAndParseData(data);
      //console.log(parsed);
      var stationAdded = addStationString(parsed);
      //console.log(stationAdded);
      //how many instances per station?
      //var test = _.countBy(stationAdded, function(i){
        //return i.POLICE_STATION;
      //});
      //console.log('test', test);
      var numericFiltered = numericFilter(stationAdded);
      //console.log(numericFiltered);
      var stringFiltered = stringFilter(numericFiltered);
      //console.log(stringFiltered);
      var booleanFiltered = booleanFilter(stringFiltered);
      console.log(booleanFiltered);
      var markers = makeMarkers(booleanFiltered);
      //console.log(markers);
      var plottedData = plotData(markers);
      //console.log(plottedData);
      //removeMarkers(markers);
    });
    if (buttonClickedId === 'reset-button'){
      console.log(plottedData);
      resetMap(plottedData);
    }
  }
}
