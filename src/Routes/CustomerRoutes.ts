/* eslint-disable prettier/prettier */
import express from 'express';
import { CustomerController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { CustomerMiddleware } from '../Middlewares';

const CustomerRoutes = express.Router();
const subRoutes = express.Router({ mergeParams: true });

CustomerRoutes.use('/:client_id([0-9]{1,24})',CustomerMiddleware.check, subRoutes);

CustomerRoutes.route('/')
    .post(CustomerController.store)
    .get(CustomerController.list)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes.route('/contact')
    .post(CustomerController.addContact)
    .get(CustomerController.contacts)
    .all(ThrowHTTPMethodNotAllowed);
    

export default CustomerRoutes;
