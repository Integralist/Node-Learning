var http = require('http');

function processRequest (request, response) {
    var body = 'Thanks for calling!\nGood to see you.',
        contentLength = body.lenggggggggggggggggggggggggggggggth; // this is obviously an error

    response.writeHead(200, {
        'Content-Length': contentLength,
        'Content-Type': 'text/plain'
    });

    response.end(body);
}

var server = http.createServer(processRequest);
    server.listen(8080);

/*
    Run your application using: `node debug xxx.js` then use the following commands to step-through the code (note: Ctrl+D to exit the debugger)...

    `cont`                      -> continue running
    `next`                      -> step over next statement
    `step`                      -> step into next statement (if possible, otherwise it just steps over)
    `out`                       -> step out of the currently executing function
    `backtrace`                 -> show the current call execution frame or call stack
    `repl`                      -> start the node repl to allow you to view variable values and execute code
    `watch(expr)`               -> add given expression to the watch list (which is shown whenever you step through anything in the debugger)
    `list(n)`                   -> list the 'n' lines of source code before and after the currently stopped line in the debugger
    `setBreakpoint(lineNumber)` -> set break-point for specified line number

    The way to use this is to have two terminal screens open.
    In the first have your `node debug xxx.js`
    In the second have your `curl –i http://localhost:8080` (don't run this command yet)

    In the first, look through your code using `list(n)`.
    Once you find a line you think might be the cause of the error use `setBreakpoint(lineNumber)`.
    Then type `cont` and go to the other terminal window and run the curl command.
    You'll see that the curl command never completes as the node debugger has taken over.
    Go back to the first terminal window and use `repl` to inspect the data at that break-point.
    You can just type the variables into the console (no need to console.log(variableName)).
    You'll need to press Ctrl+C to exit the REPL so you can continue using the debugger.
    Or you can Ctrl+D to exit debugging completely.
 */