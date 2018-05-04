AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAIVBVKDOAE3AASRHA",
    secretAccessKey: "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"
});

var docClient = new AWS.DynamoDB.DocumentClient();

//As of now this prints ALL data in the table
function readItem(table) {
    var params = {
        TableName: table
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data.Items[0])
            var arr = []
            for (let index = 0; index < data.Items.length; index += 10) {
                var t = new Date();
                t.setSeconds(data.Items[index].payload.Ts);
                var formatted = t.toISOString();
                arr.push([formatted, data.Items[index].payload.Data.Temperature])
            }
            console.log(arr.length)
            historicalTempLineChart.addTempData(arr)
        }
    }
}