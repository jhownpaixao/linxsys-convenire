/* eslint-disable prettier/prettier */
import express from 'express';
import { ContactController } from '../controllers';
import { ThrowHTTPMethodNotAllowed } from '@core';
import { CustomerMiddleware } from '../middlewares/CustomerMiddleware';

const ContactRoutes = express.Router();

ContactRoutes.route('/')
    .post(CustomerMiddleware.check, ContactController.store)
    .get(CustomerMiddleware.check, ContactController.list)
    .all(ThrowHTTPMethodNotAllowed);

export default ContactRoutes;
