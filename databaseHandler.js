AWS.config.update({
    region: "us-east-1",
    // accessKeyId default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    accessKeyId: "AKIAIVBVKDOAE3AASRHA",
    // secretAccessKey default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    secretAccessKey: "Z46irEIjQf4JUF8fqH3n0mhiDGgbqI+LdyFYq6Hk"
});

var docClient = new AWS.DynamoDB.DocumentClient();

function readItem() {
    var table = "Sensmitter01";


    var params = {
        TableName: "Sensmitter01",
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    }
}