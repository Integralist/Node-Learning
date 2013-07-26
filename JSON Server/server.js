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

    else if (shouldShowAlbumPhotos(url)) {
        loadAlbumContent(response, url, handleAlbumContent);
    }

    else {
        noContent(response);
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
    fs.readdir(__dirname + '/albums/', function (err, files) {
        if (err) {
            return callback(response, err);
        }

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
    var path = url.substring(0, url.length - 5),
        album = path.substring(path.lastIndexOf('/') + 1),
        directory = __dirname + path;

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

        callback(response, null, album, photos);
    });
}

function handleAlbumContent (response, err, album, photos) {
    if (err) {
        return displayError(response, err);
    }

    displayPhotos(response, album, photos);
}

function displayPhotos (response, album, photos) {
    var output = {
        error: null,
        data: { 
            album: album,
            photos: photos
        }
    };

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output) + '\n');
}

function noContent (response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Sorry, no content to provide to you' }) + '\n');
}