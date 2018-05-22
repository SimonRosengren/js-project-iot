//  Set the region AccessKeyId and secret. Needs to be hidden
AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAIVBVKDOAE3AASRHA",
    secretAccessKey: "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"
});

var docClient = new AWS.DynamoDB.DocumentClient();

//table = name of db table
//linechart = chart to fill with data
function fillWithHistoricalData(table, lineChart) {
    var params = {
        TableName: table
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.log(err)
        } else {
            var arr = []
            //Takes only every 10th datapoint
            for (let index = 0; index < data.Items.length; index += 10) {
                var t = new Date(0);
                t.setSeconds(data.Items[index].payload.timestamp);
                arr.push([t, data.Items[index].payload.data.temperature])
            }
            lineChart.addData(arr)
        }
    }
}
// Function for filling the Sound Histroical chart with data.
function fillScatterChartWithHistoricalData(table, scatterChart) {
    var params = {
        TableName: table
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.log(err)
        } else {
            
            var arr = []

            //Takes only every 10th datapoint
            for (let index = 0; index < data.Items.length; index ++) {
                var t = new Date(0);
                t.setSeconds(data.Items[index].payload.timestamp);
                arr.push([[t.getHours(),t.getMinutes(),t.getSeconds()], data.Items[index].payload.data.sound_level])
            }
            scatterChart.addData(arr)
        }
    }
}
// Function for filling the Humdity Historical chart with data.
function fillHistoricalHumidityChart(table, humidityChart) {
    var params = {
        TableName: table
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.log(err)
        } else {
            
            var arr = []

            //Takes only every 10th datapoint
            for (let index = 0; index < data.Items.length; index ++) {
                if(data.Items[index].payload.uid === 'arduino_due_1'){
                    var t = new Date(0);
                    t.setSeconds(data.Items[index].payload.timestamp);
                    arr.push([t, data.Items[index].payload.data.humidity])
                }
            }
            humidityChart.addData(arr)
        }
    }
}