/* eslint-disable prettier/prettier */
import express from 'express';
import { AuthController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { Request as JWTRequest } from 'express-jwt';
import { AuthMiddleware } from '../Middlewares/AuthMiddleware';
const routes = express.Router();

/* Main AuthRoute */
routes
    .route('/')
    .post(AuthController.initLogin)
    .all(ThrowHTTPMethodNotAllowed);

routes
    .route('/validate/:ekm/:edc')
    .get(AuthController.validateAuthRequest)
    .all(ThrowHTTPMethodNotAllowed);

routes
    .route('/sign')
    .get(AuthController.signData)
    .all(ThrowHTTPMethodNotAllowed);

routes.route('/verify')
    .get(AuthController.verifyData)
    .all(ThrowHTTPMethodNotAllowed);

routes
    .route('/teste')
    .get(AuthMiddleware.Authorization, function (req: JWTRequest, res: express.Response) {
        console.log(req.auth);
        res.send({ message: 'OKKKK' });
    })
    .all(ThrowHTTPMethodNotAllowed);

export default routes;
