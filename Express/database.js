var mongo = require('continuable-mongo');

module.exports = mongo('mongodb://localhost:27017/TestDBName'); // will create the database if it doesn't already exist

// var col = createClient(config.mongo_url).collection('foo');

/*
// NATIVE MONGODB DRIVER...

var Db         = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server     = require('mongodb').Server;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

// w:1 tells mongo to wait until at least one confirmed write has succeeded before calling any callbacks

var flags  = { w: 1 };
var server = new Server(host, port, { auto_reconnect: true, poolSize: 20 });
var db     = new Db('TestDBName', server, flags);

module.exports = db.open(function (err, client) {
    if (err) {
        return console.error(err);
    }

    return client;
});

// LATER ON IN OUR OTHER FILE (INSIDE A ROUTE)...

client.collection('myCollection', function (err, myCollection) {
    if (err) {
        return console.error(err);
    }

    var docrow = {
        id: '123',
        name: 'Mark',
        date: new Date(),
        description: 'Some text here'
    };

    myCollection.insert(docrow, { safe: true }, function (err, insertedDocument) {
        if (err && err.name === 'MongoError' && err.code === 11000) {
            return console.log('This document already exists');
        } else if (err) {
            return console.log('Something bad happened');
        }

        myCollection.find({ name: 'Mark' }).toArray(function (err, docs) {
            docs.forEach(function (err, doc) {
                console.log(doc);
            });
        });
    });


    res.end('OK we made it');
});
*/