var fs = require('fs'),
    http_handlers = require('./http');

module.exports = {
    loadPage: function (req, res, file) {
        this.checkFileExists(req, res, file, function (err, file) {
            if (err) {
                this.displayErrorPage(req, res);
            }

            this.streamContent(req, res, file);
        }.bind(this));
    },

    checkFileExists: function (req, res, file, callback) {
        fs.exists(file, function (exists) {
            if (!exists) {
                return callback('error');
            }

            callback(null, file);
        });
    },

    displayErrorPage: function (req, res) {
        var content = 'Sorry, the file does not exist';

        res.status(404);
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Length', content.length);

        return res.end(content);
    },

    streamContent: function (req, res, file) {
        var readStream = fs.createReadStream(file);

        readStream.on('error', function (e) {
            // Once headers are sent they can't be sent again 
            // so we make sure we check the file exists first
            // and then here we can just call `end`
            return res.end();
        });

        res.setHeader('Content-Type', http_handlers.returnContentTypeFor(file));
        
        readStream.pipe(res);
    }
};