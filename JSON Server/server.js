var http = require('http'),
    fs   = require('fs');

var server = http.createServer(processRequest);
    server.listen(8080);

function processRequest (request, response) {
    console.log('INCOMING REQUEST: ' + request.method + ', ' + request.url);

    loadAlbumList(handleAlbumList);

    function loadAlbumList (callback) {
        fs.readdir('albums/', function (err, files) {
            if (err) {
                callback(err);
                return;
            }

            files = files.filter(function (value) {
                if (/^\./i.test(value)) {
                    return false;
                }
                
                return true;
            });

            callback(null, files);
        });
    }

    function handleAlbumList (err, albums) {
        if (err) {
            displayError(err);
            return;
        }

        displaySuccess(albums);
    }

    function displayError (err) {
        response.writeHead(503, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(err) + '\n');
    }

    function displaySuccess (albums) {
        var output = {
            error: null,
            data: { albums: albums }
        };

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output) + '\n');
    }
}