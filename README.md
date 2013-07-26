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