export let delimiter = '\n';
let isWin = /^win/.test(process.platform);
if(isWin) {
  delimiter = '\r';
}
