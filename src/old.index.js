#!/usr/bin/env node

const lineReader = require('line-reader');
const program = require('commander');
const fileExists = require('file-exists');
var tilde = require('tilde-expansion');

import pkg from './../package.json';
import * as fs from 'fs';
import * as os from 'os';
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
  testerAT,
  testerHASH,
  testerIncludeAT,
  testerIncludeHASH,
  includepathRegExp
} from './lib/expressions';
import {
  append
} from './lib/writer';

// const chalk = require('chalk');
let sourcefile; // will hold the source file path
let targetfile; // will hold the target file path
let usesdtout = false; // should output go to stdout
let verbose = false; // write report
let includePaths = [];
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
// commander programm
program.version(pkg.version)
  .option('-i --input <input>', 'define the source file where the #includes happen', input)
  .option('-o --ouput <ouput>', 'define the target file in which to bundle', output)
  .option('-s --stdout', 'should output to stdout')
  .option('-r --report', `should output infos about the process to stdout.
    Should be disabled when flag --stdout is given`)
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
}
// should it go to stdout?
if (program.stdout) {
  verbose = false;
  usesdtout = true;
}

let count = 1; // count the lines
let targetfilepath = path.resolve(process.cwd(), targetfile); // get the path
// and check if it is right
if (fileExists(targetfilepath)) {
  console.log(warn(messages.targetexists));
  fs.writeFileSync(targetfilepath, ''); // clear the file
}
// read the sourcefile line by line
lineReader.eachLine(sourcefile, function(line, last) {
  // console.log(includepathRegExp);
  // console.log(line);
  // if(line.match(includepathRegExp)) {
  //   // console.log('Found include path');
  //   line = line.split(/^.*?[\/\/.*?@|#].*?includepath/);
  //   line = line[1].replace(/["|'']/g, '');
  //   let paths = line.split(';');
  //   // console.log('paths: ', paths);
  //   for(let i = 0; i < paths.length; i++) {
  //     // console.log(`paths[${i}]`, paths[i]);

  //     if(paths[i].trim().indexOf('~') === 0) {
  //       // console.log('match');
  //       // console.log(path.join(os.homedir(), paths[i].trim().replace('~/', '')));
  //       paths[i] = path.join(os.homedir(), paths[i].trim().replace('~/', ''));
  //       // matched homedir osx
  //       if(verbose) {
  //         say('found a home dir string');
  //       }
  //     }
  //     if(checkDirectorySync(paths[i])) {
  //       includePaths.push(paths[i]);
  //     }
  //   }
  //   // so we found a include path
  //   // lets asume that there is no include statement in this line
  //   // would be dirty dirty dirty
  //   count++;
  // } else {
  let foundIncludepathAT = testerIncludeAT.test(line);
  let foundIncludepathHASH = testerIncludeHASH.test(line);
  if (verbose === true) {
    console.log(`nothing found in line #${count}`);
  }
    // we have no include path.
    // lets check for all the other includes
  // test for AT includes
  let foundAT = testerAT.test(line);
  let foundHASH = testerHASH.test(line);
  let mark = `${(foundAT === true ? '@' : '#')}`;
  if (foundAT === true || foundHASH === true) {
    if (verbose === true && foundAT === true) {
      console.log(say(`Line: ${count} || you are using "@"`));
      console.log(say(line));
    } else if (verbose === true && foundHASH === true) {
      console.log(warn(`Line: ${count} || Mhe!. You are using "#", "@" is cooler`));
    }  // close else if
      // TODO this RegExp needs some refinement
    let expression = new RegExp(/[\"|'](.*?)[\"|']/g); // regex for the path in the inlude
    let match = expression.exec(line); // get the matches
    if (match.length !== 0) {
      let sourcefilepath = path.resolve(process.cwd(), sourcefile);
      let sourcefilefolder = path.dirname(sourcefilepath);
      includePaths.push(sourcefilefolder);
      var extractedpath = match[0].slice(1, -1);
      console.log('extractedpath', extractedpath);

      let foundFile = false;
      for(var j = 0; j < includePaths.length; j++) {
        let resolvedpath = path.resolve(includePaths[j], extractedpath);
        console.log('resolvedpath', resolvedpath);

        if (fileExists(resolvedpath)) {
          if (verbose) {
            console.log(woohoo(`Line: ${count} || ${mark}include ${resolvedpath}`));
          }
          let content = fs.readFileSync(resolvedpath, 'utf8');
          append(targetfilepath, content, `Line: ${count} || Replaced line ${count} with content of file`, 'woohoo', verbose);
          foundFile = true;
            // break;
        }
      } // end of loop
      if(foundFile === false) {
        if (verbose) {
          error(`File "${extractedpath}" not found`);
        }
        append(targetfilepath, `${line} // FILE NOT FOUND by ${pkg.name}`, `Line: ${count} || wrote line with ${mark}include back to bundle with ERROR mark`, 'error', verbose);
      }

    } else {
      // testerAT found something but the regex could not find a path between "" or ''
      append(targetfilepath, `${line} // NO PATH FOUND in this line by ${pkg.name}`, `Line: ${count} || Wrote line "${line}" with @include back to bundle with ERROR mark`, 'error', verbose);
    }
  } else {
    append(targetfilepath, line, null, 'woohoo', verbose);
  }
  // }// no includepath found in this line
  count++;
});
