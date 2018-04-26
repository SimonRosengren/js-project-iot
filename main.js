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
      var message = this.state === 'close';
      return message ? "The blinds are " + this.state + "d" : "The blinds are " + this.state;  
    }
  }

  function Hue(json){
    this.timestamp = timestamp;
    this.powerState = json.command.powerState;
    this.brightness = json.command.brightness;
    this.toString = function(){
      return "The lights are " + this.powerState + " and set to " + this.brightness + "%";
    }
  }


