var http = require('http'),
    path = require('path'),
    fs   = require('fs');

function processRequest (request, response) {
    if (request.method.toLowerCase() === 'get' && request.url.substring(0, 9) === '/content/') {
        // serveStaticFile(request.url.substring(9), response);
        serveStaticFileViaPipe(request.url.substring(9), response);
    } else {
        response.writeHead(404, {
            'Content-Type': 'application/json'
        });

        var out = {
            error: 'not_found',
            message: '\'' + request.url + ' not found'
        };

        response.end(JSON.stringify(out) + '\n');
    }
}

function serveStaticFile (file, response) {
    var readStream  = fs.createReadStream(file);

    response.writeHead(200, {
        'Content-Type': returnContentTypeFor(file)
    });

    readStream.on('readable', function(){
        var data = readStream.read();

        if (data) {
            if (typeof data === 'string') {
                response.write(data);
            } else if (typeof data === 'object' && data instanceof Buffer) {
                response.write(data.toString('utf8'));
            }
        }
    });

    readStream.on('end', function(){
        response.end();
    });

    readStream.on('error', function (e) {
        response.writeHead(404, {
            'Content-Type': 'application/json'
        });

        var out = {
            error: 'not_found',
            message: '\'' + file + ' not found'
        };

        return response.end(JSON.stringify(out) + '\n');
    });
}

function serveStaticFileViaPipe (file, response) {
    fs.exists(file, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'application/json'
            });

            var out = {
                error: 'not_found',
                message: '\'' + file + ' not found'
            };

            return response.end(JSON.stringify(out) + '\n')
        }

        var readStream  = fs.createReadStream(file);

        readStream.on('error', function (e) {
            // Once headers are sent they can't be sent again 
            // so we make sure we check the file exists first
            // and then here we can just call `end`
            return response.end();
        });

        response.writeHead(200, {
            'Content-Type': returnContentTypeFor(file)
        });

        readStream.pipe(response);
    });
}

function returnContentTypeFor (file) {
    var extension = path.extname(file),
        type;

    switch (extension.toLowerCase()) {
        case '.html': type = 'text/html';
        case '.js'  : type = 'text/javascript';
        case '.css' : type = 'text/css';
        case '.jpg' : type = 'image/jpeg';
        default     : type = 'text/plain';
    }

    return type;
}

var server = http.createServer(processRequest);
    server.listen(8080);