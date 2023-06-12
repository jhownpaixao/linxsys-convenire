/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '@core';
import { FileController } from '../controllers/FileController';
import { FileMiddleware } from '../middlewares/FileMiddleware';

const FilesRoutes = express.Router();

FilesRoutes
    .route('/upload')
    .post(FileMiddleware.upload('file') ,FileController.upload)
    .all(ThrowHTTPMethodNotAllowed);

export default FilesRoutes;
