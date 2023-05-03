/* eslint-disable prettier/prettier */
import express from 'express';
import { CustomerController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';

const ContactRoutes = express.Router();

ContactRoutes
    .route('/')
    .post(CustomerController.store)
    .get(CustomerController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default ContactRoutes;
