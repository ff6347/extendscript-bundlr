import {
  defaults
} from './defaults.js';
export const messages = {
  nosource: 'No source file path provided!',
  sourceDoesNotExist: function(p) {
    return `The file at path "${p}" does not exist`;
  },
  targetexists: 'target file exists. clearing',
  notarget: `No target file path provided. using default name: "${defaults.targetfile}"`
};
