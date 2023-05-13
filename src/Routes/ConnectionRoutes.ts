/* eslint-disable prettier/prettier */
import express from 'express';
import { ConnectionController } from '../controllers';
import { ServerConfig, ThrowHTTPMethodNotAllowed } from '@core';
import { ConnectionMiddleware } from '../middlewares';
import ConnectionProfileRoutes from './ConnectionProfileRoutes';

const ConnectionRoutes = express.Router();
const routsManagment = express.Router({ mergeParams: true });

ConnectionRoutes.use('/:connection_id([0-9]{1,24})', ConnectionMiddleware.check, routsManagment);
ConnectionRoutes.use(ServerConfig.ROUTES.profile, ConnectionProfileRoutes);

ConnectionRoutes
    .route('/')
    .post(ConnectionController.store)
    .get(ConnectionController.list)
    .all(ThrowHTTPMethodNotAllowed);

routsManagment
    .route('/')
    .get(ConnectionController.get)
    .all(ThrowHTTPMethodNotAllowed);

routsManagment
    .route(ServerConfig.ROUTES.profile)
    .post(ConnectionController.addProfile) //<-- Apenas usado para criar uma novo perfil sem vinculação
    .get(ConnectionController.getProfile)
    .put(ConnectionController.linkProfile)
    .all(ThrowHTTPMethodNotAllowed);

export default ConnectionRoutes;
