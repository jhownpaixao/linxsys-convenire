/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '@core';
import { ASMController } from '../controllers/ASMController';

const ASMRoutes = express.Router();

ASMRoutes
    .route('/extensions')
    .get(ASMController.listExtensions)
    .all(ThrowHTTPMethodNotAllowed);

ASMRoutes
    .route('/calls')
    .get(ASMController.listActiveCalls)
    .all(ThrowHTTPMethodNotAllowed);

export default ASMRoutes;
