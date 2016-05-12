import * as fs from 'fs';
import {
  woohoo,
  warn,
  error,
  say
} from './reporter';
export function append(filepath, content, msg, msgtype, verbose) {
  fs.appendFile(filepath, content + '\n', (err) => {
    if (err) {
      throw err;
    } else {
      if (verbose) {
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
