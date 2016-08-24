const chalk = require('chalk');

export let error = chalk.bold.red;
export let warn = chalk.bold.yellow;
export let woohoo = chalk.bold.green;
export let say = chalk.gray;

export function pad(msg) {
  return `------ ${msg} ------`;
}
