var express = require('express'),
    app = express();

app.use(express.compress())         // gzip all content
   .use(express.static('public'))   // serve static files from this directory
   .use(express.bodyParser())       // handle file uploads
   .use(express.responseTime());    // send response time via header

require('./routes.js')(app);

app.listen(8080);