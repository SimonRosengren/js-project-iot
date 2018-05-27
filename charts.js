//  Function for the pressure gauge

function PressureChart(pressure) {
  this.data = google.visualization.arrayToDataTable([
    ['Pressure', 'psi'],
    ['pressure', pressure],
    ['rest', 4000-pressure]
  ]);

  // Design 
  var options = {
    legend: 'none',
    pieSliceText: 'none',
    pieStartAngle: 0,
    pieSliceBorderColor: 'transparent',
    backgroundColor: {
      fillOpacity: 0
    },
    animation: {
      duration: 2500,
      easing: 'inAndOut'
    },
    pieHole: 0.7,
    tooltip: { trigger: 'none' },
    pieSliceTextStyle: {
      color: 'white', fontSize: 16
    },
    slices: {
      0: { color: '#f77f2e' },
      1: { color: 'transparent'}
    }
  };

  var chart = new google.visualization.PieChart(document.getElementById('pressure_chart_div'));

  //  Draw the graph
  this.draw = function () {
    chart.draw(this.data, options)
  }
  //  Function to set the new pressure when it's live
  this.setPressureValue = function (pressure) {
    this.data = google.visualization.arrayToDataTable([
      ['Pressure', 'psi'],
      ['pressure', parseFloat(pressure)],
      ['rest', 4000 - parseFloat(pressure)]
    ]);
    $('#pressurenumber').html(pressure);
    this.draw();
  }
}

//  Function for the sound gauge
function SoundLevelChart(soundLevel) {
  this.data = google.visualization.arrayToDataTable([
    ['Sound', 'db'],
    ['sound', soundLevel],
    ['rest', 100-soundLevel]
  ]);

  //  Make width and height auto fit div
  var options = {
    legend: 'none',
    pieSliceText: 'none',
    pieStartAngle: 0,
    pieSliceBorderColor: 'transparent',
    backgroundColor: {
      fillOpacity: 0
    },
    animation: {
      duration: 2500,
      easing: 'inAndOut'
    },
    pieHole: 0.7,
    tooltip: { trigger: 'none' },
    pieSliceTextStyle: {
      color: 'white', fontSize: 16
    },
    slices: {
      0: { color: '#f77f2e' },
      1: { color: 'transparent'}
    }
  };

  var chart = new google.visualization.PieChart(document.getElementById('sound_chart_div'));

  //  Draw the graph
  this.draw = function () {
    chart.draw(this.data, options)
  }
  //  Function to set the pressure when it's life
  this.setSoundLevel = function (soundLevel) {
    this.data = google.visualization.arrayToDataTable([
      ['Sound', 'C'],
      ['sound', soundLevel],
      ['rest', 100 - soundLevel]
    ]);
    $('#soundnumber').html(soundLevel + " dB");
    this.draw();
  }
};

//  Function for the temperature gauge

function TemperatureChart() {
  var data = google.visualization.arrayToDataTable([
    ['Temperature', 'C'],
    ['temp', 35],
    ['rest', 100-35]
  ]);
  // Design 
  var options = {
    legend: 'none',
    pieSliceText: 'none',
    pieStartAngle: 0,
    pieSliceBorderColor: 'transparent',
    backgroundColor: {
      fillOpacity: 0
    },
    animation: {
      duration: 2500,
      easing: 'inAndOut'
    },
    pieHole: 0.7,
    tooltip: { trigger: 'none' },
    pieSliceTextStyle: {
      color: 'white', fontSize: 16
    },
    slices: {
      0: { color: '#f77f2e' },
      1: { color: 'transparent'}
    }
  };

  var chart = new google.visualization.PieChart(document.getElementById('temp_chart_div'));

  // Set input data to the new tempature
  // Then draws the charts.
  this.setTemperature = function(temp) {
    tempInt = parseFloat(temp, 10)
    data = google.visualization.arrayToDataTable([
      ['Temperature', 'C'],
      ['temp', tempInt],
      ['rest', 100 - tempInt]
    ]);
    $('#tempnumber').html(tempInt + "°C");
    this.draw();
  }
  // Draw the chart
  this.draw = function(){
    chart.draw(data, options);
  }

}

//  Function for the humidity graph

function HumidityChart(humidity) {
  var tableData = [
    ['Time', 'Sens 1', 'Sen 2', 'Sens 3', 'Ardur'],
    ['', 0, 0, 0, 0]
  ];
  this.data = google.visualization.arrayToDataTable(tableData);
  this.sensmitter1 = [];
  this.sensmitter2 = 0;
  this.sensmitter3 = 0;
  this.ardurino = 0;
  //  Design options
  this.options = {
    title: 'Live Humidity',
    width: GetWidth(),
    backgroundColor: {
      fill: '#FF0000',
      fillOpacity: 0
    }
  };
  var chart = new google.charts.Line(document.getElementById('humidity_chart_div'));

  //  Draw the graph
  this.draw = function () {
    chart.draw(this.data, google.charts.Line.convertOptions(this.options));
  }
  // Adds a new value to Sensmitter 1 graf.
  // Then redraws the chart.
  this.addSensmitter1 = function (timestamp, data) {

    this.sensmitter1.push(data);

    var date = new Date(0)
    date.setSeconds(timestamp)

    tableData.push([date.getHours() + ":" + date.getMinutes(), this.sensmitter1[this.sensmitter1.length - 1], this.sensmitter2, this.sensmitter3, this.ardurino]);
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }
  // Adds a new value to Sensmitter 2 graf.
  // Then redraws the chart.
  this.addSensmitter2 = function (timestamp, data) {

    this.sensmitter2 = data;

    var date = new Date(0)
    date.setSeconds(timestamp)
    tableData.push([date.getHours() + ":" + date.getMinutes(), this.sensmitter1[this.sensmitter1.length - 1], data, this.sensmitter3, this.ardurino]);
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }
  // Adds a new value to Sensmitter 3 graf.
  // Then redraws the chart.
  this.addSensmitter3 = function (timestamp, data) {

    this.sensmitter3 = data;

    var date = new Date(0)
    date.setSeconds(timestamp)
    tableData.push([date.getHours() + ":" + date.getMinutes(), this.sensmitter1[this.sensmitter1.length - 1], this.sensmitter2, data, this.ardurino]);
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }
  // Adds a new value to Ardurino graf.
  // Then redraws the chart.
  this.addArdurino = function (timestamp, data) {

    this.ardurino = data;

    var date = new Date(0)
    date.setSeconds(timestamp)
    tableData.push([date.getHours() + ":" + date.getMinutes(), this.sensmitter1[this.sensmitter1.length - 1], this.sensmitter2, this.sensmitter3, data]);
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }

}


//  Function for the historical temprature graph
function HistoricalTemperatureLineChart() {

  this.data = new google.visualization.DataTable();
  this.data.addColumn('date', 'Date');
  this.data.addColumn('number', 'Temperature');

  //  Design options
  var options = {
    title: 'Historical Temperature',
    curveType: 'function',
    hAxis: { title: 'Time', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 21.5, textStyle: { color: '#FFF' } },
    legend: { position: 'bottom' },
    backgroundColor: {
      fill: '#fffff',
      fillOpacity: 0
    },
    colors: ['white'],
    titleTextStyle: { color: '#FFF' },
    legendTextStyle: { color: '#FFF' }

  };

  this.chart = new google.visualization.LineChart(document.getElementById('historical_temp_chart_div'));

  //  Add historical data to the graph
  this.addData = function (tempData) {
    this.data.addRows(tempData)
    this.draw();

  }

  //  Function to draw graph
  this.draw = function () {
    this.chart.draw(this.data, options);
  }

}

//  Function for historical temprature graph
//  Funktionen heter Sound and time SIMON???
function HistoricalSoundAndTimeScatterChart() {

  this.data = new google.visualization.DataTable();
  this.data.addColumn('timeofday', 'Time of day');
  this.data.addColumn('number', 'dB');

  //  Design options
  this.options = {

    backgroundColor: { // I cant change the damn color____!_)@!!)1
      fill: 'transparent'
    },
    chart: {
      title: 'Temperature / Time of day',
    },
    hAxis: { title: 'Time of day' },
    vAxis: { title: 'Temperature' },


  };


  this.chart = new google.charts.Scatter(document.getElementById('historical_sound_chart_div'));

  //  Add historical data to the graph
  this.addData = function (tempData) {
    this.data.addRows(tempData)
    this.draw();
  }

  // Function to draw graph
  this.draw = function () {
    this.chart.draw(this.data, google.charts.Line.convertOptions(this.options));
  }
}
function MashUpChart () {
  
  var tableData = [
    ['Time', 'Humidity', 'Temp'],
    ['', 0, 0],
    ['', 15, 156],
    ['', null, 1231],
    ['', 23, 43]
  ];

  this.data = google.visualization.arrayToDataTable(tableData);
  //  Design options
  this.options = {

    backgroundColor: { // I cant change the damn color____!_)@!!)1
      fill: 'transparent'
    },
    chart: {
      title: 'MashUp / Date',
    },
    hAxis: { title: 'Date' },
    vAxis: { title: 'MashUp' },


  };


  this.chart = new google.charts.Scatter(document.getElementById('mashChart_div'));

  //  Add historical data to the graph
  this.addData = function (data) {
    tableData = data;
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }
  this.clearData = function(){
  
  }
  // Function to draw graph
  this.draw = function () {
    this.chart.draw(this.data, google.charts.Line.convertOptions(this.options));
    }
  }

//  Function for historical humidity graph
function HistoricalHumidityChart() {

  this.data = new google.visualization.DataTable();
  this.data.addColumn('date', 'Date');
  this.data.addColumn('number', 'Humidity');

  //  Design options
  this.options = {

    backgroundColor: { // I cant change the damn color____!_)@!!)1
      fill: 'transparent'
    },
    chart: {
      title: 'Humidity / Time of day',
    },
    hAxis: { title: 'Time of day' },
    vAxis: { title: 'Humidity' },


  };


  this.chart = new google.visualization.LineChart(document.getElementById('historical_humidity_chart_div'));

  //  Add historical data to the graph
  this.addData = function (tempData) {
    this.data.addRows(tempData)
    this.draw();
  }


  // Function to draw graph
  this.draw = function () {
    this.chart.draw(this.data, google.charts.Line.convertOptions(this.options));
  }
}
