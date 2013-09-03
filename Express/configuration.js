module.exports = function (app, express) {
    // gzip all content
    app.use(express.compress());

    // serve static files from this directory
    app.use(express.static(__dirname + '/public'));

    // handle file uploads
    app.use(express.bodyParser({ 
        keepExtensions: true, 
        uploadDir: __dirname + '/file-uploads' 
    }));

    // send response time via header
    app.use(express.responseTime());

    // global error handler
    app.use(function (err, req, res, next) {
        res.status(500);
        res.end(JSON.stringify(err) + '\n');
    });
};