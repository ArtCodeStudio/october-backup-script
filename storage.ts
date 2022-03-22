import { zip } from './zip';
import { rmSync, renameSync, createReadStream } from 'fs';
import { octoberDir } from './get-config';
import { resolve } from 'path';
import { execSync } from 'child_process';
const extract = require('extract-zip');

export const backupStorage = (zipToFile: string) => {
    return zip('storage', zipToFile);
};

export const restoreStorage = async (dir: string) => {
  const archivePath = resolve(octoberDir, 'backups', dir, 'storage.zip');
  const extractPath = resolve(octoberDir, 'backups', dir, 'storage');
  const storagePath = resolve(octoberDir, 'storage');
  try {
    await extract(archivePath, { dir: extractPath });
  } catch (err) {
    console.error(`Extraction failed for ${archivePath} => ${extractPath}`);
    throw err;
  }
  /**
   * Not using 'fs' methods here, because yarn pnp re-implementations of
   * these have a bug with file paths: https://github.com/yarnpkg/berry/issues/1818
   *
  try {
    console.log('deleting old storage dir ...', storagePath);
    rmSync(storagePath, { recursive: true });
  } catch (error) {
    console.error('Could not delete old storage dir:', error);
    throw error;
  }
  try {
    console.log('moving extracted storage to storage dir ...');
    renameSync(extractPath, storagePath);
  } catch (error) {
    console.error('Could not move extracted storage to storage dir:', error);
  }
   *
  **/
  console.log('... removing old storage');
  execSync(`rm -rf ${storagePath}`);
  console.log('... moving extracted storage to storage dir');
  execSync(`mv ${extractPath} ${storagePath}`);
}
