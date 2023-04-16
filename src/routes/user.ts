import express from 'express';
import { UserController, AttendantController, ClientController, ConnectionController } from '../Controllers';
import { ThrowHTTPMethodNotAllowed } from '../Core';
const routes = express.Router();
const User = new UserController();
const Attendant = new AttendantController();
const Client = new ClientController();
const Connection = new ConnectionController();

/**
 *
 * Main User
 *
 */
routes.route('/').post(User.insert).get(User.GetAll).all(ThrowHTTPMethodNotAllowed);

routes.route('/:user_id').get(User.get).all(ThrowHTTPMethodNotAllowed);

/**
 *
 * Attendants
 *
 */
routes.route('/:user_id/attendants').post(Attendant.add).get(Attendant.getAll).all(ThrowHTTPMethodNotAllowed);

/**
 *
 * Clients
 *
 */
routes.route('/:user_id/clients').post(Client.add).get(Client.getAll).all(ThrowHTTPMethodNotAllowed);
/* Clients -> Contacts */
routes.route('/:user_id/clients/:client_id/contacts').post(Client.addContact).get(Client.getContacts).all(ThrowHTTPMethodNotAllowed);

/**
 *
 * Connections
 *
 */
routes.route('/:user_id/connections').post(Connection.add).get(Connection.getAll).all(ThrowHTTPMethodNotAllowed);
/* Connections -> Configs*/
routes
    .route('/:user_id/connections/:connection_id/config')
    .get(Connection.getConfig)
    .patch(Connection.editConfig)
    .all(ThrowHTTPMethodNotAllowed);

export default routes;
