import { logger } from '../Logger/Logger';
import { DateDifference } from '@core/utils';
import path from 'path';
import * as fs from 'fs';
import * as fsPromisses from 'fs/promises';

export const FilePaths = {
  temporary: path.resolve(__dirname, '..', '..', '..', 'public', 'tmp'),
  image: path.resolve(__dirname, '..', '..', '..', 'public', 'images'),
  audio: path.resolve(__dirname, '..', '..', '..', 'public', 'audios'),
  document: path.resolve(__dirname, '..', '..', '..', 'public', 'documents')
};

export class FileService {
  static init() {
    this.checkPaths();
    this.clean();
  }
  static checkPaths() {
    for (const path of Object.values(FilePaths)) {
      !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true });
    }
  }

  static async clean() {
    this.list('temporary', (files) => {
      files.forEach((file) => {
        const p = FilePaths.temporary + '/' + file;
        const { birthtime } = fs.statSync(p);
        if (DateDifference(new Date(), birthtime, 'h') > 8) fs.rmSync(p, { recursive: true });
      });
    });
  }

  public static async save(filename: string, destiny: keyof typeof FilePaths) {
    const p = FilePaths.temporary + '/' + filename;
    const d = FilePaths[destiny] + '/' + filename;

    return await fsPromisses
      .rename(p, d)
      .then(() => d)
      .catch((e) => {
        logger.error({ filename, destiny, erro: e }, 'Não foi possível salvar o arquivo');
        return false;
      });
  }

  static async delete(filename: string, destiny: keyof typeof FilePaths) {
    const p = FilePaths[destiny] + '/' + filename;
    if (!fs.existsSync(p)) return false;

    return fsPromisses
      .rm(p, { recursive: true })
      .then(() => true)
      .catch((e) => {
        logger.error({ filename, destiny, erro: e }, 'Não foi possível excluir o arquivo');
        return false;
      });
  }

  static list(origin: keyof typeof FilePaths, cb: (file: string[]) => void) {
    const p = FilePaths[origin];
    fs.readdir(p, (_, file) => cb(file));
  }
}
