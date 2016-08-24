extendscript-bundlr
===================

A tool for bundling Adobe ExtendScripts that use the `//@include 'path/to/file'` or `#include 'path/to/file'` statement.

Still a Work in Progress.  


### Dependencies

- [Node.js](https://nodejs.org/en/)  

### Limitations

This tool currently only parses one file. There is no recursive parsing. You could parse the bundled file again though.  

### Install

global:  

    npm install extendscript-bundlr -g

local (not yet tested):  

    npm install extendscript-bundlr --save-dev  


### Usage

global:  

    exsbundlr --source path/to/input.js --target path/to/output.js

or

    exsbundlr -s path/to/input.js -t path/to/output.js

local:  

    ./node_modules/.bin/exsbundlr --source path/to/input.js --target path/to/output.js

You can omit the target

    exsbundlr -s path/to/input.js

This will output to a file called "exsbundlr.default.bundle.jsx"



### Todo

- [x] parse `//@include 'path/to/file'`
- [x] Also parse `#include 'path/to/file'`
- [x] Also parse `#includepath`
- [x] Also parse `@include path/to/file` (without quotes works. grrrr)
- [x] Also parse `#include path/to/file` (without quotes works. grrrr)
- [ ] Add watch function



## License

Copyright (c) 2016, Fabian "fabiantheblind" Morón Zirfas

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
