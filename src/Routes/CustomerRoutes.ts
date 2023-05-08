import express from 'express';
import { CustomerController } from '../controllers';
import { ServerConfig, ThrowHTTPMethodNotAllowed } from '@core';
import { CustomerMiddleware } from '../middlewares';

const CustomerRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

CustomerRoutes.use('/:client_id([0-9]{1,24})', CustomerMiddleware.check, subRoutes);

CustomerRoutes
    .route('/')
    .post(CustomerController.store)
    .get(CustomerController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes
    .route(ServerConfig.ROUTES.contact)
    .post(CustomerController.addContact)
    .get(CustomerController.contacts)
    .all(ThrowHTTPMethodNotAllowed);

export default CustomerRoutes;
