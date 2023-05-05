import UserRoutes from './UserRoutes';
import ConnectionRoutes from './ConnectionRoutes';
import ChatbotRoutes from './ChatbotRoutes';
import WorkflowRoutes from './WorkflowRoutes';
import AttendantRoute from './AttendantRoutes';
import AuthRoutes from './AuthRoutes';
import { Router } from 'express';
import CustomerRoutes from './CustomerRoutes';
import { UserMiddleware, AuthMiddleware } from '../Middlewares';
import { UserType } from '../Core/Types/User';

const routes = Router();

routes.use('/auth', AuthRoutes);
routes.use('/user', AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Company), UserRoutes);
routes.use('/connection', AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Company), ConnectionRoutes);
routes.use('/chatbot', AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Company), ChatbotRoutes);
routes.use('/workflow', AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Company), WorkflowRoutes);
routes.use('/attendant', AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Attendant), AttendantRoute);
routes.use('/client', AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Attendant), CustomerRoutes);

export default routes;
