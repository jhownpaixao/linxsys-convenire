/* eslint-disable prettier/prettier */
import express from 'express';
import { AuthController } from '../controllers';
import { ThrowHTTPMethodNotAllowed } from '@core';
import { AuthMiddleware, UserMiddleware } from '../middlewares';
const AuthRoutes = express.Router();

/* Main AuthRoute */
AuthRoutes.route('/login')
    .post(AuthController.login)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes.route('/logout')
    .get(AuthMiddleware.Token, UserMiddleware.recover, AuthController.logout)
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

AuthRoutes
    .route('/validate')
    .get(AuthMiddleware.Token, UserMiddleware.recover, AuthController.validate)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/validate/password')
    .post(AuthMiddleware.Token, UserMiddleware.recover, AuthController.validatePassowrd)
    .all(ThrowHTTPMethodNotAllowed);

export default AuthRoutes;
