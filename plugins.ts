import { zip } from './zip';

export const backupPlugins = (zipToFile: string) => {
    return zip('plugins', zipToFile);
};

export const restorePlugins = (date: string) => {
  // TODO
}
