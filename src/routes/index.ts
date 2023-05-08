import { ServerConfig } from '@core';
import { Router } from 'express';
import { UserMiddleware, AuthMiddleware } from '../middlewares';
import UserRoutes from './UserRoutes';
import ConnectionRoutes from './ConnectionRoutes';
import ChatbotRoutes from './ChatbotRoutes';
import WorkflowRoutes from './WorkflowRoutes';
import AttendantRoute from './AttendantRoutes';
import CustomerRoutes from './CustomerRoutes';
import AuthRoutes from './AuthRoutes';
import AssessmentRoutes from './AssessmentRoutes';

const routes = Router();

routes.use(ServerConfig.ROUTES.auth, AuthRoutes);
routes.use(ServerConfig.ROUTES.user, AuthMiddleware.Token, UserMiddleware.recover, UserRoutes);
routes.use(ServerConfig.ROUTES.connection, AuthMiddleware.Token, UserMiddleware.recover, ConnectionRoutes);
routes.use(ServerConfig.ROUTES.chatbot, AuthMiddleware.Token, UserMiddleware.recover, ChatbotRoutes);
routes.use(ServerConfig.ROUTES.workflow, AuthMiddleware.Token, UserMiddleware.recover, WorkflowRoutes);
routes.use(ServerConfig.ROUTES.attendant, AuthMiddleware.Token, UserMiddleware.recover, AttendantRoute);
routes.use(ServerConfig.ROUTES.client, AuthMiddleware.Token, UserMiddleware.recover, CustomerRoutes);
routes.use(ServerConfig.ROUTES.assessment, AuthMiddleware.Token, UserMiddleware.recover, AssessmentRoutes);

export default routes;
