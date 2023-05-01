/* eslint-disable prettier/prettier */
import express from 'express';
import { UserController, AttendantController, ClientController, ConnectionController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';

const routes = express.Router();
const subRoutes = express.Router({mergeParams:true});
const Attendant = new AttendantController();
const Client = new ClientController();
const Connection = new ConnectionController();

/* Main UserRoute */
routes.use('/:user_id',subRoutes)

routes
    .route('/')
    .post(UserController.store)
    .get(UserController.list)
    .all(ThrowHTTPMethodNotAllowed);

routes
    .route('/:user_id')
    .get(UserController.get)
    .all(ThrowHTTPMethodNotAllowed);

/* Attendants */
subRoutes
    .route('/attendants')
    .post(Attendant.add)
    .get(Attendant.getAll)
    .all(ThrowHTTPMethodNotAllowed);

/* Clients */
subRoutes
    .route('/clients')
    .post(Client.add)
    .get(Client.getAll)
    .all(ThrowHTTPMethodNotAllowed);

/* Clients -> Contacts */
subRoutes
    .route('/clients/:client_id/contacts')
    .post(Client.addContact)
    .get(Client.getContacts)
    .all(ThrowHTTPMethodNotAllowed);

subRoutes
    .route('/connections')
    .post(Connection.add).get(Connection.getAll)
    .all(ThrowHTTPMethodNotAllowed);
    
/* Connections -> Configs*/
subRoutes
    .route('/connections/:connection_id/config')
    .get(Connection.getConfig)
    .patch(Connection.editConfig)
    .all(ThrowHTTPMethodNotAllowed);

export default routes;
