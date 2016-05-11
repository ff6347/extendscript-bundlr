#!/usr/bin/env node

import pkg from './../package.json';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
const lineReader = require('line-reader');
let verex = require('verbal-expressions');
const program = require('commander');
const chalk = require('chalk');
const fileExists = require('file-exists');
let sourcefile;
let targetfile;
let error = chalk.bold.red;
let warn = chalk.bold.yellow;
let woohoo = chalk.bold.green;
let defaults = {
  targetfile: 'exsbundlr.default.bundle.jsx'
};
let messages = {
  nosource: 'No source file path provided!',
  sourceDoesNotExist: function(p) {
    return `The file at path "${p}" does not exist`;
  },
  notarget: `No target file path provided. using default name: "${defaults.targetfile}"`
};
let source = (val) => {
  // console.log(val);
  sourcefile = val;
};
let target = (val) => {
  // console.log(val);
  targetfile = val;
};
program.version(pkg.version)
  .option('-s --source <source>', 'define the source file where the #includes happen', source)
  .option('-t --target <target>', 'define the target file in which to bundle', target)
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
let count = 1;
let targetfilepath = path.resolve(process.cwd(), targetfile);
if (fileExists(targetfilepath)) {
  console.log(warn('target file exists. clearing'));
  fs.writeFileSync(targetfilepath, '');
}
lineReader.eachLine(sourcefile, function(line, last) {
  let tester = verex()
    .then('//')
    .maybe(' ')
    .then('@include')
    .maybe(' ')
    .then('\'')
    .or('"')
    .anything()
    .then('\'')
    .or('"')
    .maybe(';')
    .anything();
  // .anything()
  // .then('@inlcude')
  // .anything()
  // .endOfLine();
  // console.log(tester);
  if (tester.test(line)) {
    // console.log(chalk.green(line));
    let capture = tester.exec(line);
    let expression = new RegExp(/[\"'](.*?)[\"']/g);
    let match = expression.exec(line);
    if (match.length !== 0) {
      // console.log(woohoo(match[0]));
      // console.log(woohoo(__dirname));
      // console.log(woohoo(process.cwd()));
      let sourcefilepath = path.join(process.cwd(), sourcefile);
      let sourcefilefolder = path.dirname(sourcefilepath);
      var extractedpath = match[0].slice(1, -1);
      let resolvedpath = path.resolve(sourcefilefolder, extractedpath);
      if (fileExists(resolvedpath)) {
        console.log(woohoo(`Found in line ${count}: @inlcude ${resolvedpath}`));
        var content = fs.readFileSync(resolvedpath, 'utf8');
        fs.appendFile(targetfilepath, content + '\n', (err) => {
          if (err) {
            throw err;
          } else {
            // console.log('The "data to append" was appended to file!');
          }
        });
      }
    }
  } else {
    fs.appendFile(targetfilepath, line + '\n', (err) => {
      if (err) {
        throw err;
      } else {
        // console.log('The "data to append" was appended to file!');
      }
    });
    // console.log(line);
  }
  count++;
  // if (count === 1) {
  //   return false; // stop reading
  // }
});
