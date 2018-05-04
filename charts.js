function PressureChart(pressure) {
  this.data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['psi', pressure],
  ]);

  //Make width and height auto fit div
  var options = {
    width: 160, height: 200,
    minorTicks: 5,
    majorTicks: ["0", "", "1000", "", "2000", "", "3000", "", "4000"],
    max: 4000,
    min: 0,
    animation: {
      duration: 2500,
      easing: 'inAndOut'
    }
  };

  var chart = new google.visualization.Gauge(document.getElementById('pressure_chart_div'));


  this.draw = function () {
    chart.draw(this.data, options)
  }

  this.setPressureValue = function (pressure) {
    this.data.setValue(0, 1, pressure);
    this.draw();
  }
}


function SoundLevelChart(soundLevel) {
  this.data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['dB', soundLevel],
  ]);

  //Make width and height auto fit div
  var options = {
    redColor: '#ff7575',
    width: 160, height: 200,
    redFrom: 55, redTo: 60,
    minorTicks: 100,
    max: 60,
    min: 30,
    animation: {
      duration: 2500,
      easing: 'inAndOut'
    }
  };

  var chart = new google.visualization.Gauge(document.getElementById('sound_chart_div'));


  this.draw = function () {
    chart.draw(this.data, options)
  }

  this.setSoundLevel = function (soundLevel) {
    this.data.setValue(0, 1, soundLevel);
    this.draw();
  }
};

function TemperatureChart(temperature) {
  this.data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Temperature', temperature],
  ]);

  //Make width and height auto fit div
  var options = {
    yellowColor: '#8080ff',
    redColor: '#ff7575',
    greenColor: '#b3ffb3',
    width: 160, height: 200,
    redFrom: 27, redTo: 30,
    greenFrom: 18, greenTo: 27,
    yellowFrom: 15, yellowTo: 18,
    minorTicks: 10,
    max: 30,
    min: 15,
    animation: {
      duration: 2500,
      easing: 'inAndOut'
    }
  };

  var chart = new google.visualization.Gauge(document.getElementById('temp_chart_div'));


  this.draw = function () {
    chart.draw(this.data, options)
  }

  this.setTemperature = function (temperature) {
    this.data.setValue(0, 1, temperature);
    this.draw();
  }
}

function HumidityChart(humidity) {
  var tableData = [
    ['Time', '%'],
    ['', 1]
  ];
  this.data = google.visualization.arrayToDataTable(tableData);

  var options = {
    title: 'Humidity',
    hAxis: { title: 'Time', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0, textStyle:{ color: '#FFF'} },
    animation: {
      duration: 2500,
      easing: 'inAndOut'
    },
    backgroundColor: {
      fill: '#fffff',
      fillOpacity: 0
    },
    colors:['white'],
    titleTextStyle: { color: '#FFF' },
    legendTextStyle: { color: '#FFF' },
    hAxis: {
      color: '#FFF',
    }
  };
  var chart = new google.visualization.AreaChart(document.getElementById('humidity_chart_div'));

  this.draw = function () {
    chart.draw(this.data, options);
  }
  //Får fixa detta sen....
  this.setHumidity = function (timestamp, humidity) {
    var date = new Date(0)
    date.setSeconds(timestamp)
    tableData.push([date, humidity]);
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }

}

function HistoricalTemperatureLineChart() {

  var tableData = [
    ['Time', 'Temp'],
    ['', 21.6]    //Varför måste vi ha en tom här?
  ];

  this.data = google.visualization.arrayToDataTable(tableData);

  var options = {
    title: 'Historical Temperature',
    curveType: 'function',
    hAxis: { title: 'Time', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 21.5, textStyle:{ color: '#FFF'} },
    legend: { position: 'bottom' },
    backgroundColor: {
      fill: '#fffff',
      fillOpacity: 0
    },
    colors:['white'],
    titleTextStyle: { color: '#FFF' },
    legendTextStyle: { color: '#FFF' }

  };

  this.chart = new google.visualization.LineChart(document.getElementById('historical_temp_chart_div'));

  this.addData = function (tempData) {
    //Divide the array of arrays into seperate arrays and push them
    for (let index = 0; index < tempData.length; index++) {
      tableData.push(tempData[index]);
    }

    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }

  this.draw = function () {
    this.chart.draw(this.data, options);
  }

}

function HistoricalSoundAndTimeScatterChart() {

  this.data = new google.visualization.DataTable();
  this.data.addColumn('number', '');
  this.data.addColumn('number', '');

  var options = {
    width: 800,
    height: 680,
    chart: {
      title: 'Temperature / Time of day',
    },
    hAxis: {title: 'Time of day'},
    vAxis: {title: 'Temperature'}
  };


  this.chart = new google.charts.Scatter(document.getElementById('historical_sound_chart_div'));

  this.addData = function (tempData) {
    var arr = []
    tempData.forEach(element => {
      arr.push([Number(element[0]), parseFloat(element[1])])
    });
    this.data.addRows(arr)
    this.draw();
  }

  this.draw = function () {
    this.chart.draw(this.data, options);
  }
}

