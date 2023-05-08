/* eslint-disable prettier/prettier */
import express from 'express';
import { AuthController } from '../controllers';
import { ThrowHTTPMethodNotAllowed } from '@core';
import { AuthMiddleware } from '../middlewares';
const AuthRoutes = express.Router();

/* Main AuthRoute */
AuthRoutes.route('/')
    .post(AuthController.login)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/validate/:ekm/:edc')
    .get(AuthController.validadeLogin)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/sign')
    .get(AuthMiddleware.Token, AuthController.sign)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/verify')
    .get(AuthMiddleware.Token, AuthController.verify)
    .all(ThrowHTTPMethodNotAllowed);

export default AuthRoutes;
