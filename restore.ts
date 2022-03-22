import { getOctoberCmsConfig } from './get-config';
import { restoreDatabase } from './database';
import { restoreStorage } from './storage';
import { restorePlugins } from './plugins';
const inquirer = require('inquirer');

import { mkdirSync, readdirSync, writeFileSync, lstatSync, existsSync } from 'fs';
export interface RestoreOptions {
  database: boolean;
  plugins: boolean;
  storage: boolean;
};

export const defaultOptions: RestoreOptions = {
  database: true,
  plugins: true,
  storage: true
};

const restoreParts = {
  database: restoreDatabase,
  storage: restoreStorage,
  plugins: restorePlugins
}

const restore = async () => {
  const backupChoices = list();
  const { mainChoice } = await inquirer.prompt([{
    name: 'mainChoice',
    message: 'From which backup would you like to restore something?',
    default: 0,
    choices: backupChoices,
    type: 'list'
  }]);
  const detailChoices = Object.keys(mainChoice.options).filter(key => mainChoice.options[key]);
  const { detailChoice } = await inquirer.prompt([{
    name: 'detailChoice',
    message: `Which items would you like to restore from ${mainChoice.name}?`,
    default: 0,
    choices: detailChoices,
    type: 'checkbox'
  }]);
  console.log(JSON.stringify({ mainChoice, detailChoice }, null, 2));
  for (const part of detailChoice) {
    console.log(`restoring ${part} from ${mainChoice.name}`);
    await restoreParts[part](mainChoice.name);
    console.log(`${part} restored from ${mainChoice.name}`);
  }
};

const list = () => {
  return readdirSync('../public/backups')
    .filter(dir => lstatSync(`../public/backups/${dir}`).isDirectory())
    .map(dir => {
      const options: any = {
        database: existsSync(`../public/backups/${dir}/database.sql`),
        storage: existsSync(`../public/backups/${dir}/storage.zip`),
        plugins: existsSync(`../public/backups/${dir}/plugins.zip`),
      };
      return {
        name: `${dir} [${Object.keys(options).filter(key => options[key]).join(', ')}]`,
        value: {
          name: dir,
          options
        },
        short: dir
      };
    });
}

try {
  restore();
} catch (error) {
    throw error;
}
