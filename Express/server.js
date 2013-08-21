var http_handlers = require('./http.js'),
    express = require('express'),
    app = express();

app.get('/', function (req, res) {
    res.end('hello world');
});

app.get('/users/:name', function (req, res, next) {
    if (req.params.name === 'mark') {
        res.end('You were after: ' + req.params.name + ', boom!');
    } else {
        next(); // let some other middleware take it if they want it (if no other middleware, for example, another `get` call takes it then the page 404's)
    }
});

// We can explicitly catch any unrecognised requests...

app.get('*', function (req, res) {
    /*
        res.write('Sorry, we could not find what you were looking for');
        res.end();
    */
    
    var error = {
        code: 'not_found',
        message: 'Sorry, we could not find what you were looking for'
    }
    
    http_handlers.sendFailure(res, 404, error);
});

app.listen(8080);