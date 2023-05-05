/* eslint-disable prettier/prettier */
import express from 'express';
import { AuthController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { Request as JWTRequest } from 'express-jwt';
import { AuthMiddleware } from '../Middlewares';
const AuthRoutes = express.Router();

/* Main AuthRoute */
AuthRoutes.route('/').post(AuthController.login).all(ThrowHTTPMethodNotAllowed);

AuthRoutes.route('/validate/:ekm/:edc').get(AuthController.validadeLogin).all(ThrowHTTPMethodNotAllowed);

AuthRoutes.route('/sign').get(AuthController.sign).all(ThrowHTTPMethodNotAllowed);

AuthRoutes.route('/verify').get(AuthController.verify).all(ThrowHTTPMethodNotAllowed);

AuthRoutes.route('/teste')
    .get(AuthMiddleware.Authorization, function (req: JWTRequest, res: express.Response) {
        console.log(req.auth);
        res.send({ message: 'OKKKK' });
    })
    .all(ThrowHTTPMethodNotAllowed);

export default AuthRoutes;
