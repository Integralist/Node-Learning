var http = require('http');

function processRequest (request, response) {
    var body = 'Thanks for calling!\nGood to see you.',
        contentLength = body.length;

    response.writeHead(200, {
        'Content-Length': contentLength,
        'Content-Type': 'text/plain'
    });

    response.end(body);
}

var server = http.createServer(processRequest);
    server.listen(8080);