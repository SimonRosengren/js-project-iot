function SoundLevelChart(soundLevel) {

}



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
    greenFrom:18, greenTo:27,
    yellowFrom:15, yellowTo: 18,
    minorTicks: 10,
    max: 30,
    min: 15,
    animation: {
        duration: 2500,
        easing: 'inAndOut'
    }
  };

  var chart = new google.visualization.Gauge(document.getElementById('chart_div'));
  

  this.draw = function(){
      chart.draw(this.data, options)
    }

    this.setTemperature = function(temperature){
        this.data.setValue(0, 1, temperature);
        this.draw();
    }
}