# Node.js

## What type of work is Node useful for?

Node.js is great for common network application tasks such as those with heavy I/O (input/output) and requests to other services.

If you want to write an application that does a lot of expensive computations and calculations, you might want to consider moving these operations to other services that your Node applications can then call remotely.

This doesn't mean you should completely shy away from computationally intensive tasks. If you're doing these only some of the time, you can still include them in Node.js and take advantage of a method on the `process` global object called `nextTick`. This method basically says, "Give up control of execution, and then when you have a free moment, call the provided function." It tends to be significantly faster than just using the `setTimeout` function.

Using `nextTick` plays much better in the single-threaded world of Node event processing and callbacks, and you can use `process.nextTick` in any situation in which you are worried that a complex or slow computation is necessary. Effectively think of it in the same way as using `setTimeout` for chunking large Arrays.

Some developers believe that using `global.setImmediate` is better than `process.nextTick` because it avoids issues where `nextTick` doesn't yield to the event loop, and so `setImmediate` doesn't block other I/O.

## General Node patterns

### Naming your file

Name your main file `server.js`

### Callbacks

Callbacks generally utilise the pattern where by the first argument is an error parameter (this is either an error object or `null`). The second argument is the resulting data being passed through.

### Errors

If there is an error then another pattern is to check if the error being passed through is a truthy value and if so call an error handler function and `return;` out of the current function.

### Inline Callbacks

Inline callbacks should be kept and then a callback function passed in which we call if we find an error (we pass the error to it) and we call if there is a success (we pass null and then the success)...

```js
function loadFileContent (path, callback) {
    fs.open(path, 'r', function (err, file) {
        if (err) {
            return callback(err);
        } else if (!f) {
            return callback({ error: "invalid_handle",
                       message: "bad file handle from fs.open" });
        } else {
            callback(file);
        }
    });
}
```

When outputting JSON data there should always be an `error` property and a `data` property. The `error` can be assigned `null` if there wasn't an error, otherwise it'll be a `String` message describing the error (as this is more descriptive than an error code which would otherwise need to be looked up first). The `data` property can be assigned whatever the resulting data is.

### Returning Data/Values

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

## I/O (Streams not file system API)

It is generally considered a good idea to use Streams over the standard file system API.

For example, yes using `readFile` is async and so non-blocking (as per the benefits of using Node), but the buffer and memory of your application will get filled up (if it has lots of users making requests for that file at once) because that method stores up all the buffer content and then sends it, where as with Streams you can incrementally send data back to the client as it arrives thus emptying the buffer and memory of your application and allowing it to scale more easily.

## Events

It's a common practice for Node code to inherit from Node's core event library...

```js
var events = require('events');

function Constructor(){}

Constructor.prototype = new events.EventEmitter();
Constructor.prototype.__proto__ = events.EventEmitter.prototype;
Constructor.prototype.doSomething = function(){
    this.emit('some:event', 'data to pass to listener');
};
```

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

## RESTful APIs

The word `REST` comes from Representational State Transfer, and basically implies that you can request an accurate representation of an object from the server. REST APIs focus on four core operations (which, coincidentally, map to four HTTP request methods):

- Creation (`PUT`)
- Retrieval (`GET`)
- Updating (`POST`)
- Destruction (`DELETE`)

Some people refer to these operations as CRUD, and pretty much everything you do in your API centers around doing one of these things to objects.

Try to version your API so that users can opt-in to the particular version of your API. `domain.com/api/v1/albums/photos/`

## Middleware

Because Express comes with Connect you can `use()` any of the middleware that connect can (as long as it's also mentioned in your package.json). For a list of middleware available see [http://www.senchalabs.org/connect/](http://www.senchalabs.org/connect/).

Express actually exposes these for you: `app.use(express.compress());`

## Configuration and Node Environments

To run your app (using Express) with a particular configuration you'll need to set a `NODE_ENV` environment variable: `NODE_ENV=production && node program.js`, then you can use the `configure` method like so...

```js
app.configure('production', function(){
    app.use(express.compress()); // only gzip on production

    // OR set some variables...
    app.set('log level', 'warningsOnly')
});
```

You can also set your `NODE_ENV` variable within your application using the global `process`: `process.env.NODE_ENV = 'development'`

These methods remain for backward compatability but the up to date way to do these checks is like so...

```js
// development only
if () {
  app.set('db uri', 'localhost/dev');
}

// production only
if (app.get('env') === 'production') {
  app.set('db uri', 'n.n.n.n/prod');
}
```

## Databases

### MongoDB

- Install Database Server
- Run Database Server
- Using the interactive Shell
- Make it work with Node using compatible Driver

#### Install Database Server

Download from [http://www.mongodb.org/downloads](http://www.mongodb.org/downloads) and copy the contents of the folder (which is just a `bin` folder) to somewhere you'll remember, I did:

`~/db/mongo/2.4.6/` (2.4.6 being the version number of the server)

You'll also need to create a folder to store your databases: `~/db/mongo/2.4.6/databases/` (you can see I just added a subfolder called `databases`)

#### Run Database Server

Run `mongod --dbpath ../databases` (from within the `bin` folder).

Note: if you don't create a folder to store your databases then `mongod` can be run without the `--dbpath` flag and so will default to a `/data/db/` directory (if that doesn't exist then you'll want to create it as the database server will error otherwise).

#### Using the interactive Shell

To run the interactive shell just type `mongo` (from within the `bin` folder). You can then see all databases using `show dbs` (you'll see when starting the server that a `local` database has been automatically created).

When running the shell you only need to run the commands, nothing is persisted after the shell is closed.

So the shell has a `db` variable which tells you want database is in use. If you want to change databases use `use myNewDBName` then `db` will equal `myNewDBName`.

You can then insert records into that new database using `db.myTestCollection.insert({ name: "Mark" })` and then find that data using `db.myTestCollection.find()` which returns all records in the database.

To delete a database you create (either here in the shell or when running code
that creates a new database) first switch to using the database and the run
`db.dropDatabase()`

For a reference to the full shell commands see [http://docs.mongodb.org/manual/reference/mongo-shell/](http://docs.mongodb.org/manual/reference/mongo-shell/)

#### Make it work with Node using compatible Driver

Add `"mongodb": "1.3.x"` to your package.json file and run `npm install`

Terminology is slightly different from traditional relational databases:

- Tables = Collections
- Rows = Documents
- Cell = File
