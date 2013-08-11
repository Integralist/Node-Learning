var b1, b2, b3;

b1 = new Buffer('My name is ');
b2 = new Buffer('Mark');
b3 = Buffer.concat([b1, b2]); // use the Buffer#concat method to concatenate multiple Buffers together

console.log(b3.toString('utf8'));