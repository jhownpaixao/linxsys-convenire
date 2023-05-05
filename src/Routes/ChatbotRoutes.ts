/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { ChatbotController } from '../Controllers';

const ChatbotRoutes = express.Router();

ChatbotRoutes
    .route('/')
    .post(ChatbotController.store)
    .get(ChatbotController.list)
    .all(ThrowHTTPMethodNotAllowed);


export default ChatbotRoutes;
