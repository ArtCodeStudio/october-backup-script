import { getOctoberCmsConfig } from './get-config';
import { backupDatabase } from './database';
import { backupStorage } from './storage';
import { backupPlugins } from './plugins';
import { mkdirSync, writeFileSync } from 'fs';

const backup = async () => {
    const date = new Date().toISOString();
    const config = await getOctoberCmsConfig();

    mkdirSync(`../public/backups/${date}`, { recursive: true });

    console.log('\nDump database..');
    await backupDatabase(config.database, `../public/backups/${date}/mysql.sql`);
    console.log('Dump database done.');

    console.log('\nZip storage..');
    await backupStorage(`../public/backups/${date}/storage.zip`);
    console.log('Zip storage done.');

    console.log('\nZip plugins..');
    await backupPlugins(`../public/backups/${date}/plugins.zip`);
    console.log('Zip plugins done.');

    // mark the fresh backup as the current one
    writeFileSync(`../public/backups/.current.database`, date);
    writeFileSync(`../public/backups/.current.storage`, date);
    writeFileSync(`../public/backups/.current.plugins`, date);
};

try {
    backup();
} catch (error) {
    throw error;
}
