var http = require('http'),
    fs   = require('fs');

var server = http.createServer(processRequest);
    server.listen(8080);

function processRequest (request, response) {
    console.log('INCOMING REQUEST: ' + request.method + ', ' + request.url);

    // To help keep the other functions in this script outside of the `processRequest` function 
    // we've needed to pass around the `response` parameter, which can be a bit messy in a large 
    // code base, but for the purpose of this script is still quite readable.
    checkRequest(request, response);

    /*
        Usage: 
        curl -X GET http://localhost:8080/albums.json
        curl -X GET http://localhost:8080/albums/a.json
        curl -X GET http://localhost:8080/albums/does-not-exist.json (errors)
     */
}

function checkRequest (request, response) {
    var url = request.url;

    if (shouldShowAlbums(url)) {
        loadAlbumList(response, handleAlbumList);
    }

    if (shouldShowAlbumPhotos(url)) {
        loadAlbumContent(response, url, handleAlbumContent);
    }
}

function shouldShowAlbums (url) {
    if (url === '/albums.json') {
        return true;
    }
}

function shouldShowAlbumPhotos (url) {
    // if /albums/xxxx.json
    if (/\/albums\/.+?\.json/i.test(url)) {
        return true;
    }
}

function loadAlbumList (response, callback) {
    fs.readdir('albums/', function (err, files) {
        if (err) {
            return callback(response, err);
        }

        /*
        files = files.filter(function (value) {
            if (/^\./i.test(value)) {
                return false;
            }
            
            return true;
        });

        // The above Array filter code checks to see if the item starts with a `.` character 
        // e.g. `./` or `../`
        // But this doesn't actually test if the item is a Directory or just a file
        // Because we want to avoid accidentally displaying files we'll need another solution.
        */

        var directories = [];

        files.forEach(function (value) {
            if (fs.statSync('albums/' + value).isDirectory()) {
                directories.push(value);
            }
        });

        callback(response, null, directories);
    });
}

function handleAlbumList (response, err, albums) {
    if (err) {
        return displayError(response, err);
    }

    displaySuccess(response, albums);
}

function displayError (response, err) {
    response.writeHead(503, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(err) + '\n');
}

function displaySuccess (response, albums) {
    var output = {
        error: null,
        data: { albums: albums }
    };

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output) + '\n');
}

function loadAlbumContent (response, url, callback) {
    var directory = './' + url.substring(0, url.length - 5);

    fs.readdir(directory, function (err, files) {
        if (err) {
            return callback(response, err);
        }

        var photos = [];

        files.forEach(function (value) {
            if (fs.statSync(directory + '/' + value).isFile()) {
                photos.push(value);
            }
        });

        callback(response, null, photos);
    });
}

function handleAlbumContent (response, err, photos) {
    if (err) {
        return displayError(response, err);
    }

    displayPhotos(response, photos);
}

function displayPhotos (response, photos) {
    var output = {
        error: null,
        data: { photos: photos }
    };

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output) + '\n');
}

function noContent (response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Sorry, no content to provide to you' }) + '\n');
}