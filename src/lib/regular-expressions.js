import {woohoo, warn, error, say} from './reporter';
const regexIncludepath = /^.*?[\/\/.*?@|#].*?includepath["|']?(.+)["|']?/;
const regexInclude = /^.*?[\/\/.*?@|#].*?include(?!path)["|']?(.+)["|']?/;
const basilEdgeCase = /^.*?;.*?\%/;
export function matcher(str) {
  let regexes = [regexIncludepath, regexInclude];
  let obj = {path: null, isIncludePath: null, src: str};
  let foundSomething = false;
  for(var i = 0; i < regexes.length; i++) {
    let res = str.match(regexes[i]);
    if (res !== null) {
      foundSomething = true;
      if (i === 0) {
        if(global.verbose) console.log(woohoo('\n------ INCLUDEPATHS ------'));
        obj.isIncludePath = true;
      }else{
        if(global.verbose) console.log(woohoo('\n------ INCLUDES ------'));
      }
      if(global.verbose) console.log(say('[MATCH RESULT]:'), say(JSON.stringify(res, null, 2)));
      obj.path = res[1];
    }
  }
  return foundSomething === true ? obj : null;
}

export function cleaner (str) {
  str = str.replace(/["|\\"|\'|\\'|;]/g, '');
  return str.trim();
}

export function tildetest (str) {
  let res = cleaner(str).match(/\~/g);
  return res !== null ? true : false;
}

export function detectEdgecase (str) {
  let res = str.match(basilEdgeCase);
  return res !== null ? true : false;
}
// let verex = require('verbal-expressions');
// export const includepathRegExp = /([\/\/.*?@|#].*?includepath.*?)[\\n|\\r]/i;


// export let testerAT = verex()
//   .then('//')
//   .maybe(' ')
//   .then('@include')
//   .maybe(' ')
//   .then('\'')
//   .or('"')
//   .anything()
//   .then('\'')
//   .or('"')
//   .maybe(';')
//   .anything();

// export let testerHASH = verex()
//   .then('#')
//   .then('include')
//   .maybe(' ')
//   .then('\'')
//   .or('"')
//   .anything()
//   .then('\'')
//   .or('"')
//   .maybe(';')
//   .anything();

// export let testerIncludeAT = verex()
//   .then('//')
//   .maybe(' ')
//   .then('@includepath')
//   .anything();

// export let testerIncludeHASH = verex()
//   .then('#')
//   .then('includepath')
//   .anything();
