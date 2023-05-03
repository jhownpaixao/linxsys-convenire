/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { ChatbotController } from '../Controllers/ChatbotController';

const WorkflowRoutes = express.Router();

WorkflowRoutes
    .route('/')
    .post(ChatbotController.store)
    .get(ChatbotController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default WorkflowRoutes;
