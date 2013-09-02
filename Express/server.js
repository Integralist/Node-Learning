var express = require('express'),
    app = express();

require('./configuration')(app, express);
require('./routes')(app);

app.listen(8080);

// Global application-wide error handler
// Only use for logging purposes (otherwise your app is very unhappy at this point)
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    process.exit(-1); // terminate the node process
});

console.log(process);