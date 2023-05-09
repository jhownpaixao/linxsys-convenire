/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '@core';
import { ChatController } from '../controllers';

const ChatRoutes = express.Router();

ChatRoutes
    .route('/')
    .post(ChatController.store)
    .get(ChatController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default ChatRoutes;
