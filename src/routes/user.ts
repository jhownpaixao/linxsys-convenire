import express from "express";
import { UserController, AttendantController, ClientController } from "../Controllers";

const routes = express.Router();
const User = new UserController;
const Attendant = new AttendantController
const Client = new ClientController

/* mydomain.com/user */

/* Main Uers */
routes.post('/', User.insert);
routes.get('/', User.GetAll);
routes.get('/:user_id', User.Get);

/* Attendants */
routes.post('/:user_id/attendants', User.addAttendant);
routes.get('/:user_id/attendants', User.getAttendants);

/* Clients */
routes.post('/:user_id/clients', User.addClient);
routes.get('/:user_id/clients', User.getClients);
/* Clients -> Contacts */
routes.post('/:user_id/clients/:client_id/contacts', Client.addContact);
routes.get('/:user_id/clients/:client_id/contacts', Client.getContacts);

/* Connections */
routes.post('/:user_id/connections', User.addConnection);
routes.get('/:user_id/connections', User.getConnections);



export default routes