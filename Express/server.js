var http_handlers = require('./http.js'),
    helpers = require('./helpers.js'),
    express = require('express'),
    fs = require('fs'),
    app = express();

app.use(express.compress()) // gzip all content
   .use(express.static('public')) // serve static files from this directory
   .use(express.responseTime()); // send response time via header

/*
    If we request a file directly (e.g. home.html)
    then because we're using the `static` middleware it 
    automatically locates the files so we don't need a route
 */

app.get('/', function (req, res) {
    helpers.loadPage(req, res, 'public/home.html');
});

app.get('/testing.html', function (req, res) {
    helpers.loadPage(req, res, __dirname + req.route.path);
});

app.get('/users/:name', function (req, res, next) {
    if (req.params.name === 'mark') {
        res.end('You were after: ' + req.params.name + ', boom!');
    } else {
        next(); // let some other middleware take it if they want it (if no other middleware, for example, another `get` call takes it then the page 404's)
    }
});

app.listen(8080);