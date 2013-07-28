var after = require('after'),
    http  = require('http'),
    url   = require('url'),
    fs    = require('fs');

var server = http.createServer(processRequest);
    server.listen(8080);

var url_settings;

function processRequest (request, response) {
    console.log('INCOMING REQUEST: ' + request.method + ', ' + request.url);

    url_settings = url.parse(request.url);

    // To help keep the other functions in this script outside of the `processRequest` function 
    // we've needed to pass around the `response` parameter, which can be a bit messy in a large 
    // code base, but for the purpose of this script is still quite readable.
    checkRequest(request, response);

    /*
        Usage: 
        curl -X GET http://localhost:8080/albums.json
        curl -X GET http://localhost:8080/albums/a.json
        curl -X GET http://localhost:8080/albums/does-not-exist (errors)
        curl -X GET 'http://localhost:8080/albums.json?page=1&page_size=2'
     */
}

function checkRequest (request, response) {
    var requestedUrl = request.url;

    if (shouldShowAlbums(requestedUrl)) {
        loadAlbumList(response, handleAlbumList);
    }

    else if (shouldShowAlbumPhotos(requestedUrl)) {
        loadAlbumContent(response, requestedUrl, handleAlbumContent);
    }

    else {
        noContent(response);
    }
}

function shouldShowAlbums (requestedUrl) {
    // if /albums.json and no query string params set
    if (/\/albums\.json(?:\?.+)?/i.test(requestedUrl)) {
        return true;
    }
}

function shouldShowAlbumPhotos (requestedUrl) {
    // if /albums/xxxx.json
    if (/\/albums\/.+?\.json/i.test(requestedUrl)) {
        return true;
    }
}

function loadAlbumList (response, callback) {
    var directories = [],
        pattern     = /(\d)/g,
        pagination  = [],
        counter     = 0,
        done, match;

    fs.readdir(__dirname + '/albums/', function (err, files) {
        if (err) {
            return callback(err, response);
        }

        // done = after(files.length, callback);

        files.forEach(function (value) {
            fs.stat('albums/' + value, function (err, stat) {
                if (err) {
                    callback(err, response);
                    return callback = null; // overwrite the callback (see conditional check below)
                }

                if (stat.isDirectory()) {
                    directories.push(value);
                }

                /*
                    Using a basic counter is one way of handling asynchronous operations.
                    Because this function's closure still has access to variables 
                    outside it we can use that to help us determine when to execute the callback.
                 */
                if (++counter === files.length && callback) {
                    while ((match = pattern.exec(url_settings.query)) !== null) {
                        pagination.push(match[1]);
                        pattern.lastIndex++;
                    }

                    directories.splice(pagination[0] * pagination[1], pagination[1]);
                    
                    callback(null, response, directories);
                }
            });
        });
    });
}

function handleAlbumList (err, response, albums) {
    if (err) {
        return displayError(err, response);
    }

    displaySuccess(response, albums);
}

function displayError (err, response) {
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

function loadAlbumContent (response, requestedUrl, callback) {
    var path      = requestedUrl.substring(0, requestedUrl.length - 5),
        album     = path.substring(path.lastIndexOf('/') + 1),
        directory = __dirname + path;

    fs.readdir(directory, function (err, files) {
        if (err) {
            return callback(err, response);
        }

        var photos = [];

        files.forEach(function (value) {
            if (fs.statSync(directory + '/' + value).isFile()) {
                photos.push(value);
            }
        });

        callback(null, response, album, photos);
    });
}

function handleAlbumContent (err, response, album, photos) {
    if (err) {
        return displayError(err, response);
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