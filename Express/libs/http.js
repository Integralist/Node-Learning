var path = require('path');

module.exports = {
    makeError: function (err, msg) {
        var e = new Error(msg);
            e.code = err;
        
        return e;
    },

    invalidResource: function(){
        return this.makeError('invalid_resource', 'the requested resource does not exist.');
    },

    fileError: function (err) {
        return this.makeError('server_file_error', 'There was a file error on the server: ' + err.message);
    },

    sendSuccess: function (res, data) {
        var output = { error: null, data: data };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(output) + '\n');
    },

    sendFailure: function (res, code, err) {
        var code = (err.code) ? err.code : err.name;

        res.writeHead(code, { 'Content-Type' : 'application/json' });
        res.end(JSON.stringify({ error: code, message: err.message }) + '\n');
        
        res.write(JSON.stringify({ error: code, message: err.message }) + '\n');
    },

    returnContentTypeFor: function (file) {
        var extension = path.extname(file),
            type;

        switch (extension.toLowerCase()) {
            case '.html': type = 'text/html'; break;
            case '.js'  : type = 'text/javascript'; break;
            case '.css' : type = 'text/css'; break;
            case '.jpg' : type = 'image/jpeg'; break;
            default     : type = 'text/plain';
        }

        return type;
    }
};