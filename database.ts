import mysqldump from 'mysqldump';
import { getOctoberCmsConfig, octoberDir } from './get-config';
import { execSync } from 'child_process';
import { resolve } from 'path';


const config = getOctoberCmsConfig();

export const backupDatabase = (dumpToFile: string) => {
    if (config.database.default !== 'mysql' || config.database.connections.mysql.driver !== 'mysql') {
        throw new Error(
            `The backup script supports only mysql as database but you are using "${config.database.default}" in OctoberCMS.`,
        );
    }

    const mysqlConf = config.database.connections.mysql;

    return mysqldump({
        connection: {
            host: mysqlConf.host,
            user: mysqlConf.username,
            password: mysqlConf.password,
            database: mysqlConf.database,
            charset: mysqlConf.charset,
            port: mysqlConf.port || 3306,
        },
        dumpToFile,
    });
};

export const restoreDatabase = (dir: string) => {
  const { username, password, database } = config.database.connections.mysql;
  const filePath = resolve(octoberDir, 'backups', dir, 'database.sql');
  try {
    execSync(`mysql -u ${username} -p${password} ${database} < ${filePath}`, { encoding: 'utf8'});
  } catch (error: any) {
    if (typeof error?.message === 'string') {
      if (error.stdout) {
        error.message += `\nstdout: ${error.stdout}`;
      }
      if (error.stderr) {
        error.message += `\nstderr: ${error.stderr}`;
      }
    }
    throw error;
  }
};
