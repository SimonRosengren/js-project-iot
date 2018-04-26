google.charts.load('current', {'packages':['gauge']});

var chart;

google.charts.setOnLoadCallback(()=>{
  chart = new TemperatureChart(0);
  chart.draw();
});


var data = {
    messages: []
  };

  new Vue({
    el: '#chat',
    data: data
  });
    //Hej
  document.getElementById('send').addEventListener('click', function (e) {
    var say = document.getElementById('say')
    send(say.value);
    say.value = '';
  });



  function SigV4Utils(){}


  SigV4Utils.sign = function(key, msg) {
    var hash = CryptoJS.HmacSHA256(msg, key);
    return hash.toString(CryptoJS.enc.Hex);
  };

  SigV4Utils.sha256 = function(msg) {
    var hash = CryptoJS.SHA256(msg);
    return hash.toString(CryptoJS.enc.Hex);
  };

  SigV4Utils.getSignatureKey = function(key, dateStamp, regionName, serviceName) {
    var kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
    var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    var kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    return kSigning;
  };

  function createEndpoint(regionName, awsIotEndpoint, accessKey, secretKey) {
    var time = moment.utc();
    var dateStamp = time.format('YYYYMMDD');
    var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
    var service = 'iotdevicegateway';
    var region = regionName;
    var secretKey = secretKey;
    var accessKey = accessKey;
    var algorithm = 'AWS4-HMAC-SHA256';
    var method = 'GET';
    var canonicalUri = '/mqtt';
    var host = awsIotEndpoint;

    var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
    var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
    canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
    canonicalQuerystring += '&X-Amz-Date=' + amzdate;
    canonicalQuerystring += '&X-Amz-SignedHeaders=host';

    var canonicalHeaders = 'host:' + host + '\n';
    var payloadHash = SigV4Utils.sha256('');
    var canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;

    var stringToSign = algorithm + '\n' +  amzdate + '\n' +  credentialScope + '\n' +  SigV4Utils.sha256(canonicalRequest);
    var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
    var signature = SigV4Utils.sign(signingKey, stringToSign);

    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    connectionString = 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
    console.log(connectionString);
    return connectionString;
  }

  var endpoint = createEndpoint(
      'us-east-1', // Your Region
      'a1y7d41s0oj85v.iot.us-east-1.amazonaws.com', // Require 'lowercamelcase'!!
   // 'A315Z3LPHJMASX.iot.eu-west-1.amazonaws.com', // Require 'lowercamelcase'!!
      'AKIAIVBVKDOAE3AASRHA',
      'Z46irEIjQf4JUF8fqH3n0mhiDGgbqI+LdyFYq6Hk');
  var clientId = Math.random().toString(36).substring(7);
  var client = new Paho.MQTT.Client(endpoint, clientId);
  var connectOptions = {
    useSSL: true,
    timeout: 3,
    mqttVersion: 4,
    onSuccess: subscribe
  };
  client.connect(connectOptions);
  client.onMessageArrived = onMessage;
  client.onConnectionLost = function(e) { console.log(e) };

  function subscribe() {
    client.subscribe("#");
    console.log("subscribed");
  }

  function send(content) {
    var message = new Paho.MQTT.Message(content);
    message.destinationName = "Test/chat";
    client.send(message);
    console.log("sent");
  }

  function onMessage(message) {
    var jsonMessage = JSON.parse(message.payloadString);
    var iotObject;

    if(jsonMessage.uid === 'phone_1'){
      iotObject = new Phone(jsonMessage);
    }
    else if(jsonMessage.uid === 'sensmitter_1'){
      iotObject = new SensmitterPressure(jsonMessage);
    }
    else if(jsonMessage.uid === 'sensmitter_2' || jsonMessage.uid === 'sensmitter_3'){
      iotObject = new SensmitterTemperature(jsonMessage);
      chart.setTemperature(iotObject.temperature)
    }
    else if(jsonMessage.uid === 'lab_state'){
      iotObject = new LabState(jsonMessage);
    }
    else if(jsonMessage.uid === 'blinds_1'){
      iotObject = new Blind(jsonMessage);
    }
    else if(jsonMessage.uid === 'hue_1'){
      iotObject = new Hue(jsonMessage);
    }
    else if(jsonMessage.uid === 'arduino_due_1'){
      iotObject = new Ardunio(jsonMessage);
    }
    else if(jsonMessage.uid === 'axis_old_camera'){
      iotObject = new CameraAxis(jsonMessage);
    }
    else if(jsonMessage.uid === 'person_count'){
      iotObject = new PersonCount(jsonMessage);
    }
    else if(jsonMessage.uid === 'cameraACCC8E7E6E9F'){
      iotObject = new InAndOut(jsonMessage);
    }
    else if(jsonMessage.uid === 'eye_contact_1'){
      iotObject = new EyeContact(jsonMessage);
    }
    else{

      iotObject = { toString: function(){
        return "Unknown object found: " + JSON.stringify(jsonMessage);
      }}
    }
    data.messages.push(iotObject.toString());

    //console.log("message received: " + message.payloadString);
  }

  function Phone(json){
    this.timestamp = json.timestamp;
    this.soundlevel = json.data.sound_level;
    this.toString = function(){
      return "The phone sound level is " + this.soundlevel;
    }
  }

  function SensmitterPressure(json){
    this.timestamp = json.timestamp;
    this.humidity = json.data.humidity;
    this.light_level = json.data.light_level;
    this.pressure = json.data.pressure;
    this.toString = function(){
      return "Sensmitter pressure is " + this.pressure;
    }
  }

  function SensmitterTemperature(json){
    this.timestamp = json.timestamp;
    this.humidity = json.data.humidity;
    this.light_level = json.data.light_level;
    this.movemoent = json.data.movemoent;
    this.temperature = json.data.temperature;
    this.toString = function(){
      return "Sensmitter tempereature is " + this.temperature;
    }
  }

  function LabState(json){
    this.timestamp = json.timestamp;
    this.state = json.data.state;
    this.toString = function(){
      return "The lab is " + this.state;
    }
  }

  function Blind(json){
    this.timestamp = json.timestamp;
    this.state = json.command.blind_state;
    this.toString = function(){
      return this.state === 'close' ? "The blinds are " + this.state + "d" : "The blinds are " + this.state;  
    }
  }

  function Hue(json){
    this.timestamp = json.timestamp;
    this.powerState = json.command.powerState;
    this.brightness = json.command.brightness;
    this.toString = function(){
      return "The lights are " + this.powerState + " and set to " + this.brightness + "%";
    }
  }

  function Ardunio(json){
    this.timestamp = json.timestamp;
    this.soundLevel = json.data.sound_level;
    this.lightLevel = json.data.x_light_level;
    this.temperature = json.data.temperature;
    this.humidity = json.data.humidity;

    this.toString = function(){
      return "The Ardunio light level: " + this.lightLevel + ", tempature: " + this.temperature + " and humidity: " + this.humidity + ". The sound level are " + this.soundLevel; 
    }
  }

  function CameraAxis(json){
    this.timestamp = json.timestamp;
    this.audioAlarm = json.data.audio_alarm;

    this.toString = function(){
      return "The old Camera Axis Audio Alarm set to " + this.audioAlarm; 
    }
  }

  function PersonCount(json){
    this.timestamp = json.timestamp;
    this.count = json.data.count;
    this.predAccuracy = json.data.pred_accuracy;

    this.toString = function(){
      return "There are " + this.count + " in the lab. With an accuracy on "  + this.predAccuracy + " %";
    }
  }

  function InAndOut(json){
    this.timestamp = json.timestamp;
    this.movementDirection = json.data.movement_direction;

    this.toString = function(){
      return "Camera ACC8E7E6EAF recorded a movement " + this.movementDirection;
    }
  }

  function EyeContact(json){
    this.timestamp = json.timestamp;
    this.lookingAtCamera = json.data.looking_towards_camera;
    this.eyeContacs = json.data.eye_contacs;
    this.detectedFaces = json.data.detected_faces;

    this.toString = function(){
      return "Faces detected " + this.detectedFaces + ". Looking at the camera " + this.lookingAtCamera + ", eye contacs " + this.eyeContacs;
    }
  }


