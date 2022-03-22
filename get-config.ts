import { execSync } from 'child_process';
import { resolve } from 'path';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';

export const octoberDir = (() => {
  // Try to read from '.octoberdir' file or return '../public' as default path
  try {
    return readFileSync('.octoberdir', { encoding: 'utf8'}).trim();
  } catch (err) {
    return '../public';
  }
})();

export interface OctoberCMSConfig {
    database: {
        fetch: number;
        default: 'mysql' | 'sqlite' | 'pgsql' | 'sqlsrv';
        connections: {
            sqlite: any;
            mysql: {
                driver: 'mysql';
                host: string;
                port: number;
                database: string;
                username: string;
                password: string;
                charset: string;
                collation: string;
                prefix: string;
            };
            pgsql: any;
            sqlsrv: any;
        };
        migrations: 'migrations';
        redis: { cluster: false; default: any };
        useConfigForTesting: boolean;
    };
    app: any;
    cms: any;
}

export const getOctoberCmsConfig = (ocDir = octoberDir) => {
  // Load OctoberCMS .env file
  const env = parse(readFileSync(resolve(ocDir, '.env'), { encoding: 'utf8' }));
  const cmd = `php get-config.php ${ocDir}`;
  try {
    return JSON.parse(execSync(cmd, { env, encoding: 'utf8' }));
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
