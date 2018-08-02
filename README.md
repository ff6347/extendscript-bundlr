extendscript-bundlr
===================

A tool for bundling Adobe ExtendScripts that use the `//@include 'path/to/file'` or `#include 'path/to/file'` statement. 

Tested only on OSX 10.11 Windows test are very welcome. 


### Dependencies

- [Node.js](https://nodejs.org/en/)  

### Limitations

This tool currently only parses one file. There is no recursive parsing. You could parse the bundled file again though.  

### Install

local:  

    npm install extendscript-bundlr --save-dev  

global (not recommended):  

    npm install extendscript-bundlr -g



### Usage

```plain
  Usage: exsbundlr [options]

  Options:

    -V, --version         output the version number
    -i --input <input>    define the source file where the #includes happen
    -o --ouput <ouput>    define the target file in which to bundle
    -r --report           outputs report about the process
    -m --missing          outputs report only for missing files
    -p --prefix <prefix>  add a prefix to your script
    -h, --help            output usage information
```

local:  

    ./node_modules/.bin/exsbundlr --input path/to/input.js --output path/to/output.js

global:  

    exsbundlr --input path/to/input.js --output path/to/output.js

or

    exsbundlr -i path/to/input.js -o path/to/output.js


You can omit the target

    exsbundlr -i path/to/input.js

This will output to a file called "exsbundlr.default.bundle.jsx"

If you want to add a prefix to your script you can use the `--prefix` or `-p` option.

    ./node_modules/.bin/exsbundlr --input path/to/input.js --output path/to/output.js --prefix 'my super dupr prefix'

If you want to know what is going on use the `-r` or `--report` flag.  

    ./node_modules/.bin/exsbundlr --input path/to/input.js --output path/to/output.js --prefix 'my super dupr prefix' -r  

### Todo

- [x] parse `//@include 'path/to/file'`
- [x] Also parse `#include 'path/to/file'`
- [x] Also parse `#includepath`
- [x] Also parse `@include path/to/file` (without quotes works. grrrr)
- [x] Also parse `#include path/to/file` (without quotes works. grrrr)
- [ ] Add watch function
- [ ] recursive bundling



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
