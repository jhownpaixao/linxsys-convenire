/* eslint-disable prettier/prettier */
import express from 'express';
import { AuthController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { Request as JWTRequest } from 'express-jwt';
import { AuthMiddleware } from '../Middlewares/AuthMiddleware';
const AuthRoutes = express.Router();

/* Main AuthRoute */
AuthRoutes
    .route('/')
    .post(AuthController.initLogin)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/validate/:ekm/:edc')
    .get(AuthController.validateAuthRequest)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/sign')
    .get(AuthController.signData)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes.route('/verify')
    .get(AuthController.verifyData)
    .all(ThrowHTTPMethodNotAllowed);

AuthRoutes
    .route('/teste')
    .get(AuthMiddleware.Authorization, function (req: JWTRequest, res: express.Response) {
        console.log(req.auth);
        res.send({ message: 'OKKKK' });
    })
    .all(ThrowHTTPMethodNotAllowed);

export default AuthRoutes;