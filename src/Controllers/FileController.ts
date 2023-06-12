import type { Request, Response } from 'express';
import { SendHTTPResponse, HTTPResponseCode } from '@core';
import multer from 'multer';
import path from 'path';
import * as fs from 'fs';
import { FilePaths } from '../services/app/FileService';
export class FileController {
  static storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      !fs.existsSync(FilePaths.temporary) && fs.mkdirSync(FilePaths.temporary, { recursive: true });
      cb(null, FilePaths.temporary);
    },
    filename: (req, file, cb) => {
      const name = Date.now() + path.extname(file.originalname);
      cb(null, name);
    }
  });

  static upload = async (req: Request, res: Response) => {
    SendHTTPResponse(
      {
        message: 'Avaliação criada com sucesso',
        type: 'success',
        status: true,
        data: req.file.filename,
        code: HTTPResponseCode.created
      },
      res
    );
  };
}
