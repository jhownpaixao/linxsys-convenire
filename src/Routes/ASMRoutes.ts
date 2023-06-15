/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '@core';
import { ASMController } from '../controllers/ASMController';

const ASMRoutes = express.Router();

ASMRoutes
    .route('/extensions')
    .get(ASMController.extensionList)
    .all(ThrowHTTPMethodNotAllowed);

export default ASMRoutes;
