Streams are a powerful way to transfer large amounts of data in Node while maintaining the asynchronous, nonblocking nature of the system.

Data is streamed via a Buffer via the `request` object. The two most important events are `readable` and `end`.

Node.js applications must also interact with various streams, either with the file system or TCP, as well as handling many other forms of binary data. That's where buffers come in. When you end up writing a bunch of information through a socket, it's more efficient to have that data in binary format.

A buffer is a tricky thing to define. It's basically an Array of bytes, an entity composed of raw data. The Array isn't resizable, and in fact, you shouldn't really use any array classes. Most methods dealing with files or server responses in Node.js are actually buffers.

So we convert the Buffer into something we can read using `request.read().toString('utf8')`.

We can then use a built-in Node module `querystring` which can parse the converted string data.

For us to load HTML easily we'll use `readFile` and then `response.write` the content to the `response` object.