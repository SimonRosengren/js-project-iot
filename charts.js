//  Function for the pressure gauge

function PressureChart(pressure) {
  this.data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['psi', pressure],
  ]);

  //  Make width and height auto fit div
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

  //  Draw the graph
  this.draw = function () {
    chart.draw(this.data, options)
  }
  //  Function to set the new pressure when it's live
  this.setPressureValue = function (pressure) {
    this.data.setValue(0, 1, pressure);
    this.draw();
  }
}

//  Function for the sound gauge
function SoundLevelChart(soundLevel) {
  this.data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['dB', soundLevel],
  ]);

  //  Make width and height auto fit div
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

  //  Draw the graph
  this.draw = function () {
    chart.draw(this.data, options)
  }
  //  Function to set the pressure when it's life
  this.setSoundLevel = function (soundLevel) {
    this.data.setValue(0, 1, soundLevel);
    this.draw();
  }
};

//  Function for the temperature gauge

function TemperatureChart(temperature) {
  this.data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Temperature', temperature],
  ]);

  //  Make width and height auto fit div
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

  //  Draw the graph
  this.draw = function () {
    chart.draw(this.data, options)
  }
  //  Function to set the temperature when it's live
  this.setTemperature = function (temperature) {
    this.data.setValue(0, 1, temperature);
    this.draw();
  }
}

//  Function for the humidity graph

function HumidityChart(humidity) {
  var tableData = [
    ['Time', 'Sens 1', 'Sen 2', 'Sens 3','Ardur'],
    ['', 0,0,0,0]
  ];
  this.data = google.visualization.arrayToDataTable(tableData);
  this.sensmitter1 = [];
  this.sensmitter2 = 0;
  this.sensmitter3 = 0;
  this.ardurino = 0;
  //  Design options
  var options = {
    title: 'Live Humidity',
    hAxis: { title: 'Time', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0, textStyle:{ color: '#FFF'} },
    animation: {
      duration: 1500,
      easing: 'inAndOut'
    },
    backgroundColor: {
      fill: '#fffff',
      fillOpacity: 0
    },
    colors:['white','gray','blue','yellow'],
    titleTextStyle: { color: '#FFF' },
    legendTextStyle: { color: '#FFF' },
    hAxis: {
      color: '#FFF',
    },
    legend: {position: 'top', maxLines: 6},
  };
  var chart = new google.visualization.AreaChart(document.getElementById('humidity_chart_div'));
  google.visualization.events.addListener(chart, 'select', () => {
    var sel = chart.getSelection();
    try {
      if(sel["0"].column === 1){
        console.log("Sens 1");
        var tempData = [
          ['Time', 'Sens 1'],
          ['', 0]
        ];
        // Detta 'r feö
        this.sensmitter1.forEach( item =>{
          tempData.push(["", item]);
        });
        this.data = google.visualization.arrayToDataTable(tempData);
        this.draw();
      }
      else if(sel["0"].column === 2){
        console.log("Sens 2");
      }
      else if(sel["0"].column === 3){
        console.log("Sens 3");
      }
      else if(sel["0"].column === 4){
        console.log("Arduino");
      }
    } catch (error) {
     console.log("Error 100, read documentation for more info : " + error); 
    }

  });
  //  Function for the animation when the new value arrives
  this.animationDur = function(time){
    options.animation = time;
    console.log(options.animation)
  }

  //  Draw the graph
  this.draw = function () {
    chart.draw(this.data, options);
  }
  this.addSensmitter1 = function (timestamp, data) {

    this.sensmitter1.push(data);

    var date = new Date(0)
    date.setSeconds(timestamp)

    tableData.push([date, this.sensmitter1[this.sensmitter1.length -1],this.sensmitter2,this.sensmitter3,this.ardurino]);
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
    console.log(this.sensmitter1[this.sensmitter1.length - 1]);
  }
  this.addSensmitter2 = function (timestamp, data) {

    this.sensmitter2 = data;

    var date = new Date(0)
    date.setSeconds(timestamp)
    tableData.push([date, this.sensmitter1[this.sensmitter1.length - 1],data,this.sensmitter3,this.ardurino]);
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }
  this.addSensmitter3 = function (timestamp, data) {

    this.sensmitter3 = data;

    var date = new Date(0)
    date.setSeconds(timestamp)
    tableData.push([date, this.sensmitter1[this.sensmitter1.length - 1],this.sensmitter2,data,this.ardurino]);
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }
  this.addArdurino = function (timestamp, data) {

    this.ardurino = data;

    var date = new Date(0)
    date.setSeconds(timestamp)
    tableData.push([date, this.sensmitter1[this.sensmitter1.length - 1],this.sensmitter2,this.sensmitter3,data]);
    this.data = google.visualization.arrayToDataTable(tableData);
    this.draw();
  }

}


//  Function for the historical temprature graph
function HistoricalTemperatureLineChart() {

  var tableData = [
    ['Time', 'Temp'],
    ['', 21.6]    //Varför måste vi ha en tom här? Bra fråga asså men det är typ om man vill en text under grafen 
  ];

  this.data = google.visualization.arrayToDataTable(tableData);

  //  Design options
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

  //  Add historical data to the graph
  this.addData = function (tempData) {
    //  Divide the array of arrays into seperate arrays and push them
    for (let index = 0; index < tempData.length; index++) {
      tableData.push(tempData[index]);
    }

    this.data = google.visualization.arrayToDataTable(tableData);
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
  this.data.addColumn('number', '');
  this.data.addColumn('number', '');
  
  //  Design options
  this.options = {
    width: 1400,
    height: 680,
    backgroundColor: { // I cant change the damn color____!_)@!!)1
      fill: 'transparent'
    },
    chart: {
      title: 'Temperature / Time of day',
    },
    hAxis: {title: 'Time of day'},
    vAxis: {title: 'Temperature'},


  };


  this.chart = new google.charts.Scatter(document.getElementById('historical_sound_chart_div'));

  //  Add historical data to the graph
  this.addData = function (tempData) {
    var arr = []
    tempData.forEach(element => {
      arr.push([Number(element[0]), parseFloat(element[1])])
    });
    this.data.addRows(arr)
    this.draw();
  }

  // Function to draw graph
  this.draw = function () {
    this.chart.draw(this.data, this.options);
  }
}
