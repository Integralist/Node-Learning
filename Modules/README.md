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