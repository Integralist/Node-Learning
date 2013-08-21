var http_handlers = require('./http.js'),
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
    loadPage(req, res, 'public/home.html');
});

app.get('/testing.html', function (req, res) {
    loadPage(req, res, __dirname + req.route.path);
});

app.get('/users/:name', function (req, res, next) {
    if (req.params.name === 'mark') {
        res.end('You were after: ' + req.params.name + ', boom!');
    } else {
        next(); // let some other middleware take it if they want it (if no other middleware, for example, another `get` call takes it then the page 404's)
    }
});

app.listen(8080);

function loadPage(req, res, file) {
    checkFileExists(req, res, file, function (err, file) {
        if (err) {
            displayErrorPage(req, res);
        }

        streamContent(req, res, file);
    });
}

function checkFileExists (req, res, file, callback) {
    fs.exists(file, function (exists) {
        if (!exists) {
            return callback('error');
        }

        callback(null, file);
    });
}

function displayErrorPage (req, res) {
    var content = 'Sorry, the file does not exist';

    res.status(404);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', content.length);

    return res.end(content);
}

function streamContent (req, res, file) {
    var readStream = fs.createReadStream(file);

    readStream.on('error', function (e) {
        // Once headers are sent they can't be sent again 
        // so we make sure we check the file exists first
        // and then here we can just call `end`
        return res.end();
    });

    res.setHeader('Content-Type', http_handlers.returnContentTypeFor(file));
    
    readStream.pipe(res);
}