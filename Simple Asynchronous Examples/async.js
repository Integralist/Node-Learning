var fs = require('fs'),
    file, buffer;

function handleError () {
    console.log('ERROR: ' + err.code + ' (' + err.message + ')');
}

function handleFileOpen (err, handle) {
    if (err) {
        handleError(err);
        return;
    }

    file = handle;
    buffer = new Buffer(100000);

    // http://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback
    fs.read(file, buffer, 0, 100000, null, handleFileRead);
}

function handleFileRead (err, length) {
    if (err) {
        handleError(err);
        return;
    }

    console.log('The file is read, its content is:');
    console.log(buffer.toString('utf8', 0, length));
    fs.close(file, function(){ /* don't care */ });
}

fs.open('info.txt', 'r', handleFileOpen);