import UserRoutes from './UserRoutes';
import ConnectionRoutes from './ConnectionRoutes';
import ChatbotRoutes from './ChatbotRoutes';
import WorkflowRoutes from './WorkflowRoutes';
import AttendantRoute from './AttendantRoutes';
import AuthRoutes from './AuthRoutes';
import { Router } from 'express';
import { AuthMiddleware } from '../Middlewares/AuthMiddleware';
import CustomerRoutes from './CustomerRoutes';
import { UserMiddleware } from '../Middlewares/UserMiddleware';

const routes = Router();

routes.use('/auth', AuthRoutes);
routes.use('/user', AuthMiddleware.Authorization, UserRoutes);
routes.use('/connection', AuthMiddleware.Authorization, UserMiddleware.recover, ConnectionRoutes);
routes.use('/chatbot', AuthMiddleware.Authorization, UserMiddleware.recover, ChatbotRoutes);
routes.use('/workflow', AuthMiddleware.Authorization, UserMiddleware.recover, WorkflowRoutes);
routes.use('/attendant', AuthMiddleware.Authorization, UserMiddleware.recover, AttendantRoute);
routes.use('/client', AuthMiddleware.Authorization, UserMiddleware.recover, CustomerRoutes);

export default routes;
