/* eslint-disable prettier/prettier */
import express from 'express';
import { ConnectionController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { ConnectionMiddleware } from '../Middlewares/ConnectionMiddleware';
import { ConnectionProfileController } from '../Controllers/ConnectionProfileController';

const ConnectionRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

ConnectionRoutes.use('/:connection_id([0-9]{1,24})', ConnectionMiddleware.check, subRoutes);

ConnectionRoutes
    .route('/')
    .post(ConnectionController.store)
    .get(ConnectionController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes
    .route('/config')
    .post(ConnectionMiddleware.check , ConnectionProfileController.store) //<-- Apenas usado para criar uma novo perfil sem vinculação
    .get(ConnectionMiddleware.check , ConnectionProfileController.get)
    .patch(ConnectionMiddleware.check ,ConnectionProfileController.vincule)
    .all(ThrowHTTPMethodNotAllowed);

export default ConnectionRoutes;
