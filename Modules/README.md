`node index`

## Node `require` Rules

Node has rules for where it looks for modules that are `require()`'ed.

* Built-in module `require('fs')`, Node knows where to find it
* Custom module `require('./myOwnFile.js')`, Node looks for file in that directory
* Custom module `require('./myOwnFile')`, no extension, Node looks for a folder of that name (that folder needs a `package.json` file, if it can't find it then it automatically adds extensions such as `.js`, `.json` and finally `.node` until it finds the module
* NPM module `require('after')`, no path prefixed, Node will look for the module inside the `node_modules` directory and will move up the path tree looking at each `node_modules` directory until it finds the module. If that fails it tries `/usr/lib` or `usr/local/lib`
* Failing all of the above, Node will throw an error

## Node module packaging

If you want to split a module (e.g. JavaScript file) into multiple files (to keep your code/module functionality in a nice modular/object-oriented format) OR write unit-tests, documentation etc then you'll need to group those files into a folder and include a package.json file so Node knows what to load up (if no json file is found Node will look for an `index.js` file instead).

The important part though is if you want to reference this module via the name property (`some-random-name`) specified in the `package.json` file, you'll need to go into the folder where the `package.json` file is and run `npm link` which tells npm to put a link to the `some-random-name` package in the local machine’s default public package repository.

If this doesn't work, e.g. Node can't find the module then you'll need to check that where the `npm link` set-up the link `/usr/local/lib/node_modules/some-random-name -> /Users/markmcdonnell/Dropbox/Library/Node/Learning/Modules/custom` is actually in your Node module lookup paths (e.g. `/Users/markmcdonnell/node_modules`, `/Users/node_modules`, `/node_modules`)