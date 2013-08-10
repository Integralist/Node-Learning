var fs    = require('fs'),
    async = require('async');

loadFileContents('./test.txt', handle);

function loadFileContents (path, callback) {
    var file;

    /*
        The waterfall function takes an array of functions and executes them one at a time, 
        passing the results from each function to the next. 
        
        At the end, a resulting function is called with the results from the final function in the array. 
        
        If an error is signaled at any step of the way, execution is halted, 
        and the resulting function is called with an error instead.
     */
    async.waterfall([
            function (cb) { // cb stands for "callback"
                fs.open(path, 'r', cb);
            },

            // the handle was passed to the callback at the end of
            // the fs.open function call. async passes ALL params to us.
            function (handle, cb) {
                file = handle;
                fs.fstat(file, cb);
            },

            function (stats, cb) {
                var buffer = new Buffer(100000);
                
                if (stats.isFile()) {
                    fs.read(file, buffer, 0, 100000, null, cb);
                } else {
                    callback(makeError("not_file", "Can't load directory"));
                }
            },

            function (bytesRead, buffer, cb) {
                fs.close(file, function (err) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, buffer.toString('utf8', 0, bytesRead));
                    }
                });
            }
        ], 
        function (err, fileContents) {
            callback(err, fileContents); // called after all fns have finished, or there is an error
        }
    );
}

function handle (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
}

function makeError (err, msg) {
    var e = new Error(msg);
        e.code = msg;
    
    return e;
}