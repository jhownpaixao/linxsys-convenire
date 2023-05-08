import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { UserService, ChatbotService } from '../services/app';

export class ChatbotController {
    static store = async (req: Request, res: Response) => {
        const user_id = req.user.id;
        const { name } = req.body;

        await CheckRequest({ name });

        const chatbot = await ChatbotService.create({
            ...req.body,
            user_id: user_id
        });

        SendHTTPResponse(
            {
                message: 'Chatbot criado com sucesso',
                type: 'success',
                status: true,
                location: `${ServerConfig.ROUTES.chatbot}/${chatbot.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
    };

    static list = async (req: Request, res: Response) => {
        const user_id = req.user.id;

        const list = await UserService.listChatbots(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };

    static addWorkflow = async (req: Request, res: Response) => {
        const { chatbot_id } = req.params;
        const { name } = req.body;

        await CheckRequest({ name });

        const workflow = await ChatbotService.addWorkflow(chatbot_id, {
            name
        });

        SendHTTPResponse(
            {
                message: 'Workflow criado com sucesso',
                type: 'success',
                status: true,
                location: `${ServerConfig.ROUTES.workflow}/${workflow.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
    };

    static getWorkflow = async (req: Request, res: Response) => {
        const { chatbot_id } = req.params;
        const connection = await ChatbotService.getWorkflow(chatbot_id);

        SendHTTPResponse(
            { message: 'Carregado com sucesso', type: 'success', status: true, data: connection, code: HTTPResponseCode.created },
            res
        );
    };

    static vinculeWorkflow = async (req: Request, res: Response) => {
        const { chatbot_id } = req.params;
        const { workflow_id } = req.body;

        await CheckRequest({ workflow_id });

        await ChatbotService.setWorkflow(req.user.id, chatbot_id, workflow_id);

        SendHTTPResponse({ message: 'Workflow vínculado com sucesso', type: 'success', status: true }, res);
    };
}
