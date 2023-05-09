import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { WorkflowService, UserService } from '../services/app';

export class ChatController {
    static store = async (req: Request, res: Response) => {
        const user_id = req.user.id;
        const { name } = req.body;

        await CheckRequest({ name });

        const chat = await WorkflowService.create({
            ...req.body,
            user_id: user_id
        });
        SendHTTPResponse(
            {
                message: 'Workflow criado com sucesso',
                type: 'success',
                status: true,
                location: `${ServerConfig.ROUTES.workflow}/${chat.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
    };

    static list = async (req: Request, res: Response) => {
        const user_id = req.user.id;

        const list = await UserService.listWorkflows(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };
}
