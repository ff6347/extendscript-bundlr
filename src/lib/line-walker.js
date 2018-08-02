const lineReader = require('line-reader');
const fileExists = require('file-exists');
import pkg from './../../package.json';
import * as path from 'path';
import * as fs from 'fs';
import {append} from './writer';
const abs = require('abs');

import {woohoo, warn, error, say, pad} from './reporter';
import {matcher, cleaner, tildetest, detectEdgecase} from './regular-expressions';
import {folderExists} from './folder-exists';
import { messages } from './messages';

let lineCounter = 1;
let includePaths = [];
let sourcefilefolder = null;
export function walker(sourcefile, targetfile) {
  sourcefilefolder = path.dirname(sourcefile);
  includePaths.push(abs(sourcefilefolder));
  if (global.verbose) {
    console.log(woohoo(pad('CURRENT INCLUDEPATHS')));
  }
  if (global.verbose) {
    console.log(includePaths);
  }
  lineReader.eachLine(sourcefile, function(line, last) {
    // testing for includepath
    let res = matcher(line);
    if (res !== null) {
      if (global.verbose) {
        console.log('tilde? ', tildetest(res.path));
      }
      if (res.isIncludePath === true) {
        // console.log(res.path);
        if (detectEdgecase(res.path) === true) {
          if (global.verbose) {
            console.log(warn('[EDGE CASE]:'), warn(JSON.stringify(res.path, null, 2)));
            console.log(warn('Please write include statements into one single line'));
          }
          let edgePaths = res.path.split(';');
          for (let i = 0; i < edgePaths.length; i++) {
            let p = abs(cleaner(edgePaths[i]));
            if (folderExists(p) === true) {
              if (global.verbose) {
                console.log(warn('[EXISTS]:', woohoo(p)));
              }
              includePaths.push(p);
            }
          }
        }
        let p = abs(cleaner(res.path));
        // BASIL JS EDGECASE?
        if (folderExists(p) === true) {
          if (global.verbose) {
            console.log(warn('[EXISTS]:', woohoo(p)));
          }
          includePaths.push(p);
        }
      } else {
        if (global.verbose) {
          console.log(woohoo(pad(`POSSIBLE FILE LOCATIONS for ${res.path}`)));
        }
        // let fileDoesExist = false;
        for (var i = 0; i < includePaths.length; i++) {
          let p = path.resolve(includePaths[i], cleaner(res.path));
          if (global.verbose) {
            console.log(warn('[POSSIBLY FILE]:'), say(p));
          }
          if (fileExists(p) === true) {
            if (global.verbose) {
              console.log(warn('[FOUND FILE]:'), woohoo(`"${p}"`));
            }
            // let fileDoesExist = true;
            try {
              let output = fs.readFileSync(p, 'utf8');
              append(targetfile,
                output,
                `wrote content of ${p} to file ${targetfile}`,
                'woohoo');
              break;
            } catch (e) {
              if (global.verbose) {
                console.log(error(e));
              }
            }
          } else if (fileExists(p) === false && i === includePaths.length - 1) {
            if (global.verbose) {
              console.log(warn(`Could not find "${p}"`));
            }
            let output = line + `// FILE NOT FOUND by ${pkg.name}`;
            append(targetfile,
              output,
              `could not find ${p} in line ${lineCounter}`,
              'error');
            if (global.missing) {
              console.log(error(messages.sourceDoesNotExist(p)));
            }
          }// end of last i loop iteration
        } // end of i loop
      }
      // check if file exists
    } else {
      // nothing found in this line add it back to output file
      let output = line;
      append(targetfile,
        output,
        `nothing found in line ${lineCounter}`,
        'say');
    }
    lineCounter++;
  }); // end of line reader
}
