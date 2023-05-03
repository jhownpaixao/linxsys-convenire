/* eslint-disable prettier/prettier */
import express from 'express';
import { UserController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';

const UserRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

UserRoutes.use('/:user_id', subRoutes);

UserRoutes.route('/')
    .post(UserController.store)
    .get(UserController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes.route('/')
    .get(UserController.get)
    .all(ThrowHTTPMethodNotAllowed);

export default UserRoutes;
