/* eslint-disable prettier/prettier */
import express from 'express';
import { AuthController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { AuthMiddleware, UserMiddleware } from '../Middlewares';
import { UserType } from '../Core/Types/User';
const AuthRoutes = express.Router();

/* Main AuthRoute */
AuthRoutes
    .route('/')
    .post(AuthController.login)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/validate/:ekm/:edc')
    .get(AuthController.validadeLogin)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/sign')
    .get(AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Administrator), AuthController.sign)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/verify')
    .get(AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Administrator), AuthController.verify)
    .all(ThrowHTTPMethodNotAllowed);

export default AuthRoutes;
