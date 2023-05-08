/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '@core';
import { AssessmentController } from '../controllers';

const AssessmentRoutes = express.Router();

AssessmentRoutes
    .route('/')
    .post(AssessmentController.store)
    .get(AssessmentController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default AssessmentRoutes;
