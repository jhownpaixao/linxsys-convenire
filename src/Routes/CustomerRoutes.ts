/* eslint-disable prettier/prettier */
import express from 'express';
import { ContactController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { CustomerMiddleware } from '../Middlewares';

const CustomerRoutes = express.Router();

CustomerRoutes
    .route('/')
    .post(CustomerMiddleware.check, ContactController.store)
    .get(CustomerMiddleware.check, ContactController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default CustomerRoutes;
