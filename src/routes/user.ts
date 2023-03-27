import express from "express";
import { UserController, AttendantController } from "../controllers";

const routes = express.Router();
const User = new UserController;
const Attendant = new AttendantController


routes.post('/', User.Insert);
routes.post('/:user_id/attendants', Attendant.Insert);


routes.get('/', User.GetAll);
routes.get('/:user_id', User.Get);
routes.get('/:user_id/attendants', User.GetAttendants);






export default routes