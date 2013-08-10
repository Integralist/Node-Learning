var fs = require('fs');

loadFileContents('./test.txt', handle);

function loadFileContents (path, callback) {
    fs.open(path, 'r', function (err, file) {
        if (err) {
            return callback(err);
        } else if (!file) {
            return callback({
                error: 'invalid_handle',
                message: 'bad file handle from fs.open'
            });
        }

        fs.fstat(file, function (err, stats) {
            if (err) {
                return callback(err);
            }

            if (stats.isFile()) {
                var buffer = new Buffer(10000);

                fs.read(file, buffer, 0, 10000, null, function (err, bytesRead, currentBuffer) {
                    if (err) {
                        return callback(err);
                    }

                    fs.close(file, function (err) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, buffer.toString('utf8', 0, bytesRead));
                    });
                })
            } else {
                return callback({
                    error: 'not_file',
                    message: 'Can not load directory'
                });
            }
        })
    });
}

function handle (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
}