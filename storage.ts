import { zip } from './zip';

export const backupStorage = (zipToFile: string) => {
    return zip('storage', zipToFile);
};

export const restoreStorage = (date: string) => {
  // TODO
}
