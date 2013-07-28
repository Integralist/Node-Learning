# Node.js

## What type of work is Node useful for?

Node.js is great for common network application tasks such as those with heavy I/O (input/output) and requests to other services.

If you want to write an application that does a lot of expensive computations and calculations, you might want to consider moving these operations to other services that your Node applications can then call remotely.

This doesn't mean you should completely shy away from computationally intensive tasks. If you're doing these only some of the time, you can still include them in Node.js and take advantage of a method on the `process` global object called `nextTick`. This method basically says, "Give up control of execution, and then when you have a free moment, call the provided function." It tends to be significantly faster than just using the `setTimeout` function.

Using `nextTick` plays much better in the single-threaded world of Node event processing and callbacks, and you can use `process.nextTick` in any situation in which you are worried that a complex or slow computation is necessary. Effectively think of it in the same way as using `setTimeout` for chunking large Arrays.

Some developers believe that using `global.setImmediate` is better than `process.nextTick` because it avoids issues where `nextTick` doesn't yield to the event loop, and so `setImmediate` doesn't block other I/O.

## General Node patterns

Callbacks generally utilise the pattern where by the first argument is an error parameter (this is either an error object or `null`). The second argument is the resulting data being passed through.

If there is an error then another pattern is to check if the error being passed through is a truthy value and if so call an error handler function and `return;` out of the current function.

When outputting JSON data there should always be an `error` property and a `data` property. The `error` can be assigned `null` if there wasn't an error, otherwise it'll be a `String` message describing the error (as this is more descriptive than an error code which would otherwise need to be looked up first). The `data` property can be assigned whatever the resulting data is.

Node patterns indicate that devs like to return fast and early, but also the act of returning is generally considered to be for breaking the flow rather than needing the returned value. 

So for example, instead of...

```js
if (err) {
    displayError(err);
    return;
}
```

...you should do this...

```js
if (err) {
    return displayError(err);
}
```

...as in this example we don't care about the returned value, we're just running some code that displays an error but we also want to bail out of our current function as quickly as possible.

## Asynchronous work-arounds

There are a few ways to handle asynchronous operations in Node.

You can use a basic counter...

```js
function loadAlbumList (response, callback) {
    var directories = [],
        pattern = /(\d)/g,
        pagination = [],
        counter = 0,
        match;

    fs.readdir(__dirname + '/albums/', function (err, files) {
        if (err) {
            return callback(response, err);
        }

        files.forEach(function (value) {
            fs.stat('albums/' + value, function (err, stat) {
                if (err) {
                    callback(response, err);
                    return callback = null; // overwrite the callback (see conditional check below)
                }

                if (stat.isDirectory()) {
                    directories.push(value);
                }

                /*
                    Using a basic counter is one way of handling asynchronous operations.
                    Because this function's closure still has access to variables 
                    outside it we can use that to help us determine when to execute the callback.
                 */
                if (++counter === files.length && callback) {
                    while ((match = pattern.exec(url_settings.query)) !== null) {
                        pagination.push(match[1]);
                        pattern.lastIndex++;
                    }

                    directories.splice(pagination[0] * pagination[1], pagination[1]);
                    
                    callback(response, null, directories);
                }
            });
        });
    });
}
```

...or you can use a async library.

The following example uses the `after` module...

```js
fs.readdir(__dirname + '/albums/', function (err, files) {
    if (err) {
        return callback(err, response);
    }

    done = after(files.length, callback);

    files.forEach(function (value) {
        fs.stat('albums/' + value, function (err, stat) {
            if (err) {
                return done(err);
            }

            if (stat.isDirectory()) {
                directories.push(value);
            }

            done(null, results);
        });
    });
});
```

## Streams

Streams are a powerful way to transfer large amounts of data in Node while maintaining the asynchronous, nonblocking nature of the system.

You listen to stream events on the `Request` object (like a standard event system), mainly the `readable` and `end` events.

You then `read()` the data coming in and once the `end` event fires, pass that read data into a callback function to do something with it.

## HTTP Status'

- 200 OK—Everything went fine.

- 301 Moved Permanently—The requested URL has been moved, and the client should re-request it at the URL specified in the response.

- 400 Bad Request—The format of the client’s request is invalid and needs to be fixed.

- 401 Unauthorized—The client has asked for something it does not have permission to view. It should try again authenticating the request first.

- 403 Forbidden—For whatever reason, the server is refusing to process this request. This is not the same as 401, where the client can try again with authentication.

- 404 Not Found—The client has asked for something that does not exist.

- 500 Internal Server Error—Something happened resulting in the server being unable to process the request. You typically use this error for situations in which you know the code has entered some sort of inconsistent or buggy state and needs developer attention.

- 503 Service Unavailable—This indicates some sort of runtime failure, such as temporarily low on memory or having troubles with network resources. It’s still a fatal error like 500, but it does suggest the client could try again in a while.