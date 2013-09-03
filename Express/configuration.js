module.exports = function (app, express) {
    // set-up view folder (this is optional as express defaults to CWD/views)
    app.set('views', __dirname + '/views');

    // tell express what rendering engine we're using
    app.engine('.html', require('ejs').__express);

    // without this, when calling `res.render()` we'd need to pass the file extension
    app.set('view engine', 'html');

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