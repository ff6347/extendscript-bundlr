import {statSync} from 'fs';
export function folderExists(directory) {
  try {
    statSync(directory);
    return true;
  } catch(e) {
    // fs.mkdirSync(directory);
    return false;
  }
}
