var fs = require('fs');

function FileObject(){
    this.filename = '';
    this.fileExists = function (callback) {
        console.log('About to call: ' + this.filename);

        fs.open(this.filename, 'r', function (err, handle) {
            if (err) {
                console.log('Can\'t open: ' + this.filename);
                callback(err);
                return;
            }

            fs.close(handle, function(){ /* don't care */ });
            callback(null, true);
        }.bind(this)); // notice we're using `bind` method to allow the closure to keep scope
    }
}

var fileObject = new FileObject();
    fileObject.filename = 'file_that_does_not_exist';
    fileObject.fileExists(function (err, results) {
        if (err) {
            console.log('Aw, bummer: ' + JSON.stringify(err));
            return;
        }

        console.log('The file exists, yay!');
    });