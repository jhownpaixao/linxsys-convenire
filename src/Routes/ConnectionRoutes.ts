/* eslint-disable prettier/prettier */
import express from 'express';
import { ConnectionController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { ConnectionMiddleware } from '../Middlewares';
import ConnectionProfileRoutes from './ConnectionProfileRoutes';

const ConnectionRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

ConnectionRoutes.use('/:connection_id([0-9]{1,24})', ConnectionMiddleware.check, subRoutes);
ConnectionRoutes.use('/profile', ConnectionProfileRoutes);

ConnectionRoutes
    .route('/')
    .post(ConnectionController.store)
    .get(ConnectionController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes
    .route('/profile')
    .post(ConnectionController.addProfile) //<-- Apenas usado para criar uma novo perfil sem vinculação
    .get(ConnectionController.getProfile)
    .put(ConnectionController.vinculeProfile)
    .all(ThrowHTTPMethodNotAllowed);

export default ConnectionRoutes;
