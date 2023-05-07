/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '@Core';
import { WorkflowController } from '../Controllers/WorkflowController';

const WorkflowRoutes = express.Router();

WorkflowRoutes
    .route('/')
    .post(WorkflowController.store)
    .get(WorkflowController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default WorkflowRoutes;
