import { ServerConfig } from '@core';
import { Router } from 'express';
import { AuthMiddleware, UserMiddleware } from '../middlewares';
import ASMRoutes from './ASMRoutes';
import AssessmentRoutes from './AssessmentRoutes';
import AttendantRoute from './AttendantRoutes';
import AuthRoutes from './AuthRoutes';
import CampaingRoutes from './CampaingRoutes';
import ChatbotRoutes from './ChatbotRoutes';
import ConnectionRoutes from './ConnectionRoutes';
import CustomerRoutes from './CustomerRoutes';
import EnvironmentRoutes from './EnvironmentRoutes';
import FilesRoutes from './FilesRoutes';
import UserRoutes from './UserRoutes';
import WorkflowRoutes from './WorkflowRoutes';

const routes = Router();

routes.use(ServerConfig.ROUTES.auth, AuthRoutes);
routes.use(ServerConfig.ROUTES.user, AuthMiddleware.Token, UserMiddleware.recover, UserRoutes);
routes.use(ServerConfig.ROUTES.connection, AuthMiddleware.Token, UserMiddleware.recover, ConnectionRoutes);
routes.use(ServerConfig.ROUTES.chatbot, AuthMiddleware.Token, UserMiddleware.recover, ChatbotRoutes);
routes.use(ServerConfig.ROUTES.workflow, AuthMiddleware.Token, UserMiddleware.recover, WorkflowRoutes);
routes.use(ServerConfig.ROUTES.attendant, AuthMiddleware.Token, UserMiddleware.recover, AttendantRoute);
routes.use(ServerConfig.ROUTES.client, AuthMiddleware.Token, UserMiddleware.recover, CustomerRoutes);
routes.use(ServerConfig.ROUTES.assessment, AuthMiddleware.Token, UserMiddleware.recover, AssessmentRoutes);
routes.use(ServerConfig.ROUTES.chat, AuthMiddleware.Token, UserMiddleware.recover, ChatbotRoutes);
routes.use(ServerConfig.ROUTES.environment, AuthMiddleware.Token, UserMiddleware.recover, EnvironmentRoutes);
routes.use(ServerConfig.ROUTES.asm, AuthMiddleware.Token, UserMiddleware.recover, ASMRoutes);
routes.use(ServerConfig.ROUTES.campaing, AuthMiddleware.Token, UserMiddleware.recover, CampaingRoutes);

routes.use('/files', FilesRoutes);
export default routes;
