import UserRoutes from './UserRoutes';
import ConnectionRoutes from './ConnectionRoutes';
import ChatbotRoutes from './ChatbotRoutes';
import WorkflowRoutes from './WorkflowRoutes';
import AttendantRoute from './AttendantRoutes';
import CustomerRoutes from './CustomerRoutes';
import AuthRoutes from './AuthRoutes';
import { Router } from 'express';
import { UserMiddleware, AuthMiddleware } from '../Middlewares';
import { UserType } from '../Core/Types/User';
import { ServerConfig } from '../Core';

const routes = Router();

routes.use(ServerConfig.ROUTES.auth, AuthRoutes);
routes.use(ServerConfig.ROUTES.user, AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Company), UserRoutes);
routes.use(ServerConfig.ROUTES.connection, AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Company), ConnectionRoutes);
routes.use(ServerConfig.ROUTES.chatbot, AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Company), ChatbotRoutes);
routes.use(ServerConfig.ROUTES.workflow, AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Company), WorkflowRoutes);
routes.use(ServerConfig.ROUTES.attendant, AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Attendant), AttendantRoute);
routes.use(ServerConfig.ROUTES.client, AuthMiddleware.Token, UserMiddleware.Authorization(UserType.Attendant), CustomerRoutes);

export default routes;
