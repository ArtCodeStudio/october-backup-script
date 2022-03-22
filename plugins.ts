import { zip } from './zip';
import { rmSync, renameSync, createReadStream } from 'fs';
import { octoberDir } from './get-config';
import { resolve } from 'path';
import { execSync } from 'child_process';
const extract = require('extract-zip');

export const backupPlugins = (zipToFile: string) => {
    return zip('plugins', zipToFile);
};

export const restorePlugins = async (dir: string) => {
  const archivePath = resolve(octoberDir, 'backups', dir, 'plugins.zip');
  const extractPath = resolve(octoberDir, 'backups', dir, 'plugins');
  const pluginsPath = resolve(octoberDir, 'plugins');
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
    console.log('deleting old plugins dir ...', pluginsPath);
    rmSync(pluginsPath, { recursive: true });
  } catch (error) {
    console.error('Could not delete old plugins dir:', error);
    throw error;
  }
  try {
    console.log('moving extracted plugins to plugins dir ...');
    renameSync(extractPath, pluginsPath);
  } catch (error) {
    console.error('Could not move extracted plugins to plugins dir:', error);
  }
   *
  **/
  console.log('... removing old plugins');
  execSync(`rm -rf ${pluginsPath}`);
  console.log('... moving extracted plugins to plugins dir');
  execSync(`mv ${extractPath} ${pluginsPath}`);
}
