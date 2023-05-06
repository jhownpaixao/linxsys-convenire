/* eslint-disable prettier/prettier */
import express from 'express';
import { ConnectionController } from '../Controllers';
import { ServerConfig, ThrowHTTPMethodNotAllowed } from '../Core';
import { ConnectionMiddleware } from '../Middlewares';
import ConnectionProfileRoutes from './ConnectionProfileRoutes';

const ConnectionRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

ConnectionRoutes.use('/:connection_id([0-9]{1,24})', ConnectionMiddleware.check, subRoutes);
ConnectionRoutes.use(ServerConfig.ROUTES.profile, ConnectionProfileRoutes);

ConnectionRoutes
    .route('/')
    .post(ConnectionController.store)
    .get(ConnectionController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes
    .route(ServerConfig.ROUTES.profile)
    .post(ConnectionController.addProfile) //<-- Apenas usado para criar uma novo perfil sem vinculação
    .get(ConnectionController.getProfile)
    .put(ConnectionController.vinculeProfile)
    .all(ThrowHTTPMethodNotAllowed);

export default ConnectionRoutes;
