/* eslint-disable prettier/prettier */
import express from 'express';
import { UserController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { UserMiddleware } from '../Middlewares/UserMiddleware';

const UserRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

UserRoutes.use('/:user_id', UserMiddleware.recover, subRoutes);

UserRoutes.route('/')
    .post(UserController.store)
    .get(UserController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes.route('/')
    .get(UserController.get)
    .all(ThrowHTTPMethodNotAllowed);

export default UserRoutes;
