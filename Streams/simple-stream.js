var fs = require('fs'),
    rs = fs.createReadStream('simple-stream.js'),
    contents;

rs.on('readable', function(){
    var str, 
        data = rs.read();

    if (data) {
        if (typeof data == 'string') {
            str = data;
        } else if (typeof data == 'object' && data instanceof Buffer) {
            str = data.toString('utf8');
        }

        if (str) {
            if (!contents) {
                contents = data;
            } else {
                contents += str;
            }
        }
    }
});

rs.on('end', function(){
    console.log('read in the file contents: ');
    console.log(contents.toString('utf8'));
});