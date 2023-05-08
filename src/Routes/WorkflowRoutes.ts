/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '@core';
import { WorkflowController } from '../controllers/WorkflowController';

const WorkflowRoutes = express.Router();

WorkflowRoutes
    .route('/')
    .post(WorkflowController.store)
    .get(WorkflowController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default WorkflowRoutes;
