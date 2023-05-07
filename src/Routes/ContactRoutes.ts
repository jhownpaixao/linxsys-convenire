/* eslint-disable prettier/prettier */
import express from 'express';
import { ContactController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '@Core';
import { CustomerMiddleware } from '../Middlewares/CustomerMiddleware';

const ContactRoutes = express.Router();

ContactRoutes.route('/')
    .post(CustomerMiddleware.check, ContactController.store)
    .get(CustomerMiddleware.check, ContactController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default ContactRoutes;
