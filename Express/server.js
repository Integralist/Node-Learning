var express = require('express'),
    app = express();

app.use(express.compress())         // gzip all content
   .use(express.static('public'))   // serve static files from this directory
   .use(express.bodyParser({ 
        keepExtensions: true, 
        uploadDir: __dirname + '/file-uploads' 
   }))                              // handle file uploads
   .use(express.responseTime())     // send response time via header
   .use(function (err, req, res, next) {
        res.status(500);
        res.end(JSON.stringify(err) + '\n');
   });                              // global error handler

require('./routes')(app);

app.listen(8080);

// Global application-wide error handler
// Only use for logging purposes (otherwise your app is very unhappy at this point)
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    process.exit(-1); // terminate the node process
});

console.log(process);