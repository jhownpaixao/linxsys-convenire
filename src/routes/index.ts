import UserRoutes from './user';
import ConnectionRoutes from './connection';
import AuthRoutes from './auth';
import { Router } from 'express';
import { AuthMiddleware } from '../Middlewares/AuthMiddleware';

const routes = Router();

routes.use('/connection', AuthMiddleware.Authorization, ConnectionRoutes);
routes.use('/user', AuthMiddleware.Authorization, UserRoutes);
routes.use('/auth', AuthRoutes);

export default routes;
