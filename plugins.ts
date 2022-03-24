import { zip } from './zip';
import { writeFileSync } from 'fs';
import { octoberDir } from './get-config';
import { resolve } from 'path';
import { execSync } from 'child_process';
const extract = require('extract-zip');

export const backupPlugins = (zipToFile: string) => {
    return zip('plugins', zipToFile);
};


/**
 * We are not using 'fs' methods for deleting and moving large directories here,
 * because the yarn pnp re-implementations of these have a bug with file paths:
 * https://github.com/yarnpkg/berry/issues/1818
 **/

export const restorePlugins = async (dir: string) => {
  const archivePath = resolve(octoberDir, 'backups', dir, 'plugins.zip');
  const extractPath = resolve(octoberDir, 'backups', dir, 'plugins');
  const pluginsPath = resolve(octoberDir, 'plugins');

  /*
   * Make sure the temporary extract path does not contain leftovers from a
   * previous failed attempt.
   */
  console.log('... cleaning extract path');
  execSync(`rm -rf ${extractPath}`);

  console.log('... extracting plugins from backup');
  try {
    await extract(archivePath, { dir: extractPath });
  } catch (err) {
    console.error(`Extraction failed for ${archivePath} => ${extractPath}`);

    console.log('... cleaning extract path');
    execSync(`rm -rf ${extractPath}`);

    throw err;
  }
  console.log('... removing old plugins dir');
  execSync(`rm -rf ${pluginsPath}`);
  console.log('... moving extracted plugins to plugins dir');
  execSync(`mv ${extractPath} ${pluginsPath}`);

  // Mark the fresh backup as the current one.
  writeFileSync(resolve(octoberDir, 'backups', '.current.plugins'), dir);
}
