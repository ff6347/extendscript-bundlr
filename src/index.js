#!/usr/bin/env node

const lineReader = require('line-reader');
const program = require('commander');
const fileExists = require('file-exists');
import pkg from './../package.json';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import {
  defaults
} from './lib/defaults';
import {
  messages
} from './lib/messages';
import {
  woohoo,
  warn,
  error,
  say
} from './lib/reporter';
import {
  testerAT
} from './lib/expressions';
import {
  append
} from './lib/writer';
// const chalk = require('chalk');
let sourcefile;
let targetfile;
let usesdtout = false;
let verbose = false;
// let error = chalk.bold.red;
// let warn = chalk.bold.yellow;
// let woohoo = chalk.bold.green;
let input = (val) => {
  // console.log(val);
  sourcefile = val;
};
let output = (val) => {
  // console.log(val);
  targetfile = val;
};
program.version(pkg.version)
  .option('-i --input <input>', 'define the source file where the #includes happen', input)
  .option('-o --ouput <ouput>', 'define the target file in which to bundle', output)
  .option('-s --stdout', 'should output to stdout')
  .option('-r --report', `should output infos about the process to stdout.
    Should be disabled when flag --stdout is given`)
  .parse(process.argv);
if (!sourcefile) {
  console.log(error(messages.nosource));
  process.exit();
}
if (!fileExists(sourcefile)) {
  console.log(error(messages.sourceDoesNotExist(sourcefile)));
  process.exit();
}
if (!targetfile) {
  console.log(warn(messages.notarget));
  targetfile = defaults.targetfile;
}
if (program.report) {
  verbose = true;
}
if (program.stdout) {
  verbose = false;
  usesdtout = true;
}
let count = 1;
let targetfilepath = path.resolve(process.cwd(), targetfile);
if (fileExists(targetfilepath)) {
  console.log(warn('target file exists. clearing'));
  fs.writeFileSync(targetfilepath, '');
}
lineReader.eachLine(sourcefile, function(line, last) {
  if (testerAT.test(line)) {
    if (verbose) {
      console.log(say(line));
    }
    let capture = testerAT.exec(line);
    let expression = new RegExp(/[\"'](.*?)[\"']/g);
    let match = expression.exec(line);
    if (match.length !== 0) {
      if (verbose) {
        console.log(woohoo(match[0]));
      }
      if (verbose) {
        console.log(woohoo(__dirname));
      }
      if (verbose) {
        console.log(woohoo(process.cwd()));
      }
      let sourcefilepath = path.join(process.cwd(), sourcefile);
      let sourcefilefolder = path.dirname(sourcefilepath);
      var extractedpath = match[0].slice(1, -1);
      let resolvedpath = path.resolve(sourcefilefolder, extractedpath);
      if (fileExists(resolvedpath)) {
        if (verbose) {
          console.log(woohoo(`Found in line ${count}: @inlcude ${resolvedpath}`));
        }
        let content = fs.readFileSync(resolvedpath, 'utf8');
        append(targetfilepath, content, 'Wrote content of file to bundle', 'woohoo', verbose);
      } else {
        if (verbose) {
          error(`File "${resolvedpath}" not found`);
        }
        append(
          targetfilepath,
          `${line} // FILE NOT FOUND by ${pkg.name}`,
          'Wrote line with @include back to bundle with ERROR mark',
          'error',
          verbose);
      }
    }
  } else {
    append(targetfilepath, line, 'Wrote line to bundle', 'woohoo', verbose);
  }
  count++;
});
