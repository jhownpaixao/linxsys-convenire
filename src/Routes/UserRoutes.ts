/* eslint-disable prettier/prettier */
import express from 'express';
import { UserController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '@Core';

const UserRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

UserRoutes.use('/:user_id([0-9]{1,24})', subRoutes);

UserRoutes.route('/')
    .post(UserController.store)
    .get(UserController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes.route('/')
    .get(UserController.get)
    .patch(UserController.update)
    .delete(UserController.exclude)
    .all(ThrowHTTPMethodNotAllowed);

export default UserRoutes;
