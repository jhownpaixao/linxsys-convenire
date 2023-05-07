/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '@Core';
import { ChatbotController } from '../Controllers';
import { ChatbotMiddleware } from '../Middlewares';

const ChatbotRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

ChatbotRoutes.use('/:chatbot_id([0-9]{1,24})', ChatbotMiddleware.check, subRoutes);

ChatbotRoutes.route('/')
    .post(ChatbotController.store)
    .get(ChatbotController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes
    .route('/workflow')
    .post(ChatbotController.addWorkflow)
    .get(ChatbotController.getWorkflow)
    .put(ChatbotController.vinculeWorkflow)
    .all(ThrowHTTPMethodNotAllowed);

export default ChatbotRoutes;
