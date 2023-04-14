import express from "express";
import { AuthController } from "../Controllers";
import { ThrowHTTPMethodNotAllowed } from "../Core";
import { expressjwt, Request as JWTRequest } from "express-jwt";
const routes = express.Router();
const Auth = new AuthController;

/* mydomain.com/user */

/** 
 * 
 * Main Auth
 * 
*/
routes
    .route('/')
    .post(Auth.initLogin)
    .all(ThrowHTTPMethodNotAllowed)

routes
    .route('/validate/:ekm/:edc')
    .get(Auth.validateAuthRequest)
    .all(ThrowHTTPMethodNotAllowed)

routes
    .route('/sign')
    .get(Auth.signData)
    .all(ThrowHTTPMethodNotAllowed)

routes
    .route('/verify')
    .get(Auth.verifyData)
    .all(ThrowHTTPMethodNotAllowed)

routes
    .route('/teste')
    .get(Auth.authorization, function (req: JWTRequest, res: express.Response) {

        console.log(req.auth);
        res.send({ message: 'OKKKK' })

    })
    .all(ThrowHTTPMethodNotAllowed)

export default routes