import * as fs from 'fs';

import {
  woohoo,
  warn,
  error,
  say
} from './reporter';

import {delimiter} from './os-detect';

export function append(filepath, content, msg, msgtype, verbose) {

  fs.appendFile(filepath, content + delimiter, (err) => {
    if (err) {
      throw err;
    } else {
      if (verbose === true && msg !== null) { // eslint-disable-line no-lonely-if
        switch (msgtype) {
          case 'warn':
            console.log(warn(msg));
            // statements_1
            break;
          case 'error':
            console.log(error(msg));
            break;
          case 'woohoo':
            console.log(woohoo(msg));
            break;
          case 'say':
            console.log(say(msg));
            break;
          default:
            console.log(say(msg));
            break;
        }
      }
    }
  });
}
