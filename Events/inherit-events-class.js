var events = require('events');

function Downloader(){}

Downloader.prototype = new events.EventEmitter();
Downloader.prototype.__proto__ = events.EventEmitter.prototype;

// Simulate a fake download of the requested path
Downloader.prototype.downloadUrl = function (path) {
    this.url = path;
    this.emit('start', path);

    global.setTimeout(function(){
        this.emit('end', path);
    }.bind(this), 2000);
};

var d = new Downloader();
    
d.on('start', function (path) {
    console.log('Started downloading: ' + path);
});

d.on('end', function (path) {
    console.log('Finished downloading: ' + path);
});

d.downloadUrl('http://www.integralist.co.uk/')