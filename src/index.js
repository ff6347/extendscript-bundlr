#!/usr/bin/env node
const program = require('commander');
const fileExists = require('file-exists');
// const chalk = require('chalk');
import * as fs from 'fs';
import * as path from 'path';
import pkg from './../package.json';
import {woohoo, warn, error, say} from './lib/reporter';
import {defaults} from './lib/defaults';
import {messages} from './lib/messages';
import {walker} from './lib/line-walker';
import {delimiter} from './lib/os-detect';

let sourcefile; // will hold the source file path
let targetfile; // will hold the target file path
// let usesdtout = false; // should output go to stdout
let verbose = false; // write report
global.verbose = false;
global.missing = false;
// let includePaths = [];
// let outputContent = null;
let prefix = '';
// handle input
let input = (val) => {
  // console.log(val);
  sourcefile = val;
};
// handle output
let output = (val) => {
  // console.log(val);
  targetfile = val;
};

let pre = (val) => {
  prefix = val;
};
// commander programm
program.version(pkg.version)
  .option('-i --input <input>', 'define the source file where the #includes happen', input)
  .option('-o --ouput <ouput>', 'define the target file in which to bundle', output)
  // .option('-s --stdout', 'should output to stdout')
  .option('-r --report', 'outputs report about the process')
  .option('-m --missing', 'outputs report only for missing files')
  .option('-p --prefix <prefix>', 'add a prefix to your script', pre)
  .parse(process.argv);
// check if the user provided a source file
// if not error end exit
if (!sourcefile) {
  console.log(error(messages.nosource));
  process.exit();
}
// check if the provided source file exists
if (!fileExists(path.resolve(process.cwd(), sourcefile))) {
  console.log(error(messages.sourceDoesNotExist(sourcefile)));
  process.exit();
}
// check if there is a target file path
if (!targetfile) {
  console.log(warn(messages.notarget));
  targetfile = defaults.targetfile;
}
// does the user want the report?
if (program.report) {
  verbose = true;
  global.verbose = true;
}
// does the user want the report mssing files?
if (program.missing) {
  // verbose = true;
  global.missing = true;
}
// should it go to stdout?
// if (program.stdout) {
//   verbose = false;
//   usesdtout = true;
// }

if (program.prefix) {
  // console.log(prefix);
}
if (fileExists(path.resolve(process.cwd(), targetfile))) {
  if (global.verbose) {
    console.log(warn(messages.targetexists));
  }
}
fs.writeFileSync(path.resolve(process.cwd(), targetfile), `${prefix}${delimiter}`); // clear the file
walker(sourcefile, path.resolve(process.cwd(), targetfile), verbose);

