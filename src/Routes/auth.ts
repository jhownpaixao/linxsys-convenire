import express from "express";
import { AuthController } from "../Controllers";
import { ThrowHTTPMethodNotAllowed } from "../Core";
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
    .route('/create')
    .get(Auth.createKeys)
    .all(ThrowHTTPMethodNotAllowed)

export default routes