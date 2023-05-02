/* eslint-disable prettier/prettier */
import express from 'express';
import { UserController, CustomerController, ConnectionController, AttendantController, ContactController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
import { UserMiddleware } from '../Middlewares/UserMiddleware';
import { CustomerMiddleware } from '../Middlewares/CustomerMiddleware';
import { ConnectionMiddleware } from '../Middlewares/ConnectionMiddleware';
import { ConnectionProfileController } from '../Controllers/ConnectionProfileController';

const routes = express.Router();
const subRoutes = express.Router({ mergeParams: true });
const Connection = new ConnectionController();

/* Main UserRoute */
routes.use('/:user_id', UserMiddleware.check, subRoutes);

routes
    .route('/')
    .post(UserController.store)
    .get(UserController.list)
    .all(ThrowHTTPMethodNotAllowed);

routes
    .route('/:user_id')
    .get(UserMiddleware.check, UserController.get)
    .all(ThrowHTTPMethodNotAllowed);

/* Attendants */
subRoutes
    .route('/attendants')
    .post(AttendantController.store)
    .get(AttendantController.list)
    .all(ThrowHTTPMethodNotAllowed);

/* Customers */
subRoutes
    .route('/clients')
    .post(CustomerController.store)
    .get(CustomerController.list)
    .all(ThrowHTTPMethodNotAllowed);
/* Clients -> Contacts */
subRoutes
    .route('/clients/:client_id/contacts')
    .post(CustomerMiddleware.check, ContactController.store)
    .get(CustomerMiddleware.check, ContactController.list)
    .all(ThrowHTTPMethodNotAllowed);

/* Connections */
subRoutes
    .route('/connections')
    .post(ConnectionController.store)
    .get(ConnectionController.list)
    .all(ThrowHTTPMethodNotAllowed);
/* Connections -> Configs*/
subRoutes
    .route('/connections/:connection_id/config')
    .post(ConnectionMiddleware.check , ConnectionProfileController.store) //<-- Apenas usado para criar uma novo perfil sem vinculação
    .get(ConnectionMiddleware.check , ConnectionProfileController.get)
    .patch(ConnectionMiddleware.check ,ConnectionProfileController.vincule)
    .all(ThrowHTTPMethodNotAllowed);



export default routes;
