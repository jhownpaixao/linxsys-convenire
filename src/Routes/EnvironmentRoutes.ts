/* eslint-disable prettier/prettier */
import express from 'express';
import { EnvironmentController } from '../controllers';
import { ThrowHTTPMethodNotAllowed } from '@core';

const EnvironmentRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

EnvironmentRoutes.use('/:env_id([0-9]{1,24})', subRoutes);

EnvironmentRoutes.route('/')
    .post(EnvironmentController.store)
    .get(EnvironmentController.list)
    .all(ThrowHTTPMethodNotAllowed);

EnvironmentRoutes.route('/sign')
    .post(EnvironmentController.sign)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes.route('/')
    .get(EnvironmentController.get)
    .put(EnvironmentController.update)
    .delete(EnvironmentController.exclude)
    .all(ThrowHTTPMethodNotAllowed);

export default EnvironmentRoutes;
    