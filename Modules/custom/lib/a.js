var fs = require('fs'),
    b  = require('./b.js');

console.log('log: a');

exports.version = '1.0.0';

exports.a = 'a';

exports.b = b.b;