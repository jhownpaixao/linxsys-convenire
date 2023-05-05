/* eslint-disable prettier/prettier */
import express from 'express';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { ConnectionProfileController } from '../Controllers';
import { ConnectionMiddleware } from '../Middlewares';

const ConnectionProfileRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

ConnectionProfileRoutes.use('/:profile_id([0-9]{1,24})', ConnectionMiddleware.checkProfile, subRoutes);

ConnectionProfileRoutes
    .route('/')
    .post(ConnectionProfileController.store)
    .get(ConnectionProfileController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes
    .route('/chatbot')
    .post(ConnectionProfileController.addChatbot)
    .get(ConnectionProfileController.getChatbot)
    .put(ConnectionProfileController.vinculeChatbot)
    .all(ThrowHTTPMethodNotAllowed);


export default ConnectionProfileRoutes;
