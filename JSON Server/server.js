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
        curl -s -X POST -H "Content-Type: application/json" -d '{ "album": "a_renamed" }' http://localhost:8080/albums/a/rename.json
     */
}

function checkRequest (request, response) {
    var requestedUrl = request.url;

    if (shouldShowAlbums(requestedUrl)) {
        loadAlbumList(response, handleAlbumList);
    }

    else if (shouldRenameAlbum(requestedUrl)) {
        renameAlbum(request, response);
    }

    else if (shouldShowAlbumPhotos(requestedUrl)) {
        loadAlbumContent(response, requestedUrl, handleAlbumContent);
    }

    else {
        sendFailure(response, 404, invalidResource(core_url));
    }
}

function shouldShowAlbums (requestedUrl) {
    // if /albums.json and no query string params set
    if (/\/albums\.json(?:\?.+)?/i.test(requestedUrl)) {
        return true;
    }
}

function shouldRenameAlbum (requestedUrl) {
    // if /albums/xxx/rename.json and no query string params set
    if (/\/albums\/\w+\/rename\.json$/i.test(requestedUrl)) {
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
        results = {
            response: response,
            directories: directories
        },
        done;

    fs.readdir(__dirname + '/albums/', function (err, files) {
        if (err) {
            return callback(err, response);
        }

        done = after(files.length, callback);

        files.forEach(function (value) {
            fs.stat('albums/' + value, function (err, stat) {
                if (err) {
                    return done(err);
                }

                if (stat.isDirectory()) {
                    directories.push(value);
                }

                done(null, results);
            });
        });
    });
}

function handleAlbumList (err, results) {
    if (err) {
        return sendFailure(results.response, 404, err);
    }

    sendSuccess(results.response, {
        albums: calculatePagination(results.directories)
    });
}

function calculatePagination (directories) {
    var pattern     = /(\d)/g,
        pagination  = [],
        match;

    while ((match = pattern.exec(url_settings.query)) !== null) {
        pagination.push(match[1]);
        pattern.lastIndex++;
    }

    return directories.splice(0, pagination[1]);
}

function loadAlbumContent (response, requestedUrl, callback) {
    var path      = requestedUrl.substring(0, requestedUrl.length - 5),
        album     = path.substring(path.lastIndexOf('/') + 1),
        directory = __dirname + path;

    fs.readdir(directory, function (err, files) {
        if (err) {
            return callback(err, response);
        }

        var photos  = [],
            done    = after(files.length, callback),
            results = {
                response: response,
                album: album,
                photos: photos
            };

        files.forEach(function (item) {
            fs.stat(directory + '/' + item, function (err, stat) {
                if (err) {
                    return done(err);
                }

                if (stat.isFile()) {
                    photos.push(item);
                }

                done(null, results);
            });
        });
    });
}

function handleAlbumContent (err, results) {
    if (err) {
        return sendFailure(results.response, 404, err);
    }

    sendSuccess(results.response, { 
        album: results.album,
        photos: results.photos
    });
}

function renameAlbum (request, response) {
    var core_url = url_settings.pathname,
        url_sections = core_url.split('/');

    if (url_sections.length !== 4) {
        return sendFailure(response, 404, invalidResource(core_url));
    }

    var albumName = url_sections[2],
        jsonBody = '';

    request.on('readable', function(){
        var data = request.read();

        if (data) {
            if (typeof data == 'string') {
                jsonBody += data;
            } else if (typeof data == 'object' && data instanceof Buffer) {
                jsonBody += data.toString('utf8');
            }
        }
    });

    request.on('end', function(){
        if (jsonBody) {
            try {
                var albumData = JSON.parse(jsonBody);

                if (!albumData.album) {
                    return sendFailure(response, 403, missingData('album'));
                }
            } catch (err) {
                return sendFailure(response, 403, badJson());
            }

            processAlbumRename(albumName, albumData.album, function (err, results) {
                if (err && err.code === 'ENOENT') {
                    return sendFailure(response, 403, noSuchAlbum());
                } else if (err) {
                    return sendFailure(response, 500, fileError(err));
                }

                sendSuccess(response, null);
            });
        } else {
            sendFailure(response, 403, badJson());
            response.end();
        }
    });
}

function processAlbumRename (oldName, newName, callback) {
    fs.rename('albums/' + oldName, 'albums/' + newName, callback);
}

// HTTP HANDLERS...

function makeError (err, msg) {
    var e = new Error(msg);
        e.code = err;
    
    return e;
}

function sendSuccess (response, data) {
    var output = { error: null, data: data };

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output) + '\n');
}

function sendFailure (response, code, err) {
    var code = (err.code) ? err.code : err.name;

    response.writeHead(code, { 'Content-Type' : 'application/json' });
    response.end(JSON.stringify({ error: code, message: err.message }) + '\n');
}

function invalidResource() {
    return makeError('invalid_resource', 'the requested resource does not exist.');
}

function noSuchAlbum() {
    return makeError('no_such_album', 'The specified album does not exist');
}

function fileError (err) {
    return makeError('server_file_error', 'There was a file error on the server: ' + err.message);
}

function missingData (missing) {
    var msg = missing
        ? 'Your request is missing: \'' + missing + '\''
        : 'Your request is missing some data.';
    return makeError('missing_data', msg);
}

function badJson() {
    return makeError('invalid_json', 'the provided data is not valid JSON');
}