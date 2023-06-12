import multer from 'multer';
import { FileController } from '../controllers/FileController';

export class FileMiddleware {
  static upload = (field: string) => {
    return multer({ storage: FileController.storage }).single(field);
  };
}
