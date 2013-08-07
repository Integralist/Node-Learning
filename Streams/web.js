var http = require('http'),
    fs   = require('fs');

var server = http.createServer(processRequest);
    server.listen(8080);

function processRequest (request, response) {
    var formData = '';

    request.on('readable', function(){
        formData += request.read().toString('utf8'); // request.read() is an instanceof Buffer
        console.log('read: ', formData);
    });

    request.on('end', function(){
        console.log('end: ', formData);
    });

    fs.readFile('form.html', function (err, data) {
        response.writeHead(200, {
            'Content-Length': data.length,
            'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
    });
}

// HTTP HANDLERS...

function makeError (err, msg) {
    var e = new Error(msg);
        e.code = err;
    
    return e;
}

function sendSuccess (response, data) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(data);
}

function sendFailure (response, code, err) {
    response.writeHead(code, { 'Content-Type' : 'text/html' });
    response.end(err);
}

function invalidResource() {
    return makeError('invalid_resource', 'the requested resource does not exist.');
}