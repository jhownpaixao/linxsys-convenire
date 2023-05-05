import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode } from '../Core';
import { UserService, ChatbotService } from '../Services/AppService';

export class ChatbotController {
    static store = async (req: Request, res: Response) => {
        const user_id = req.user.id;
        const { name } = req.body;

        await CheckRequest({ name });

        const contact = await ChatbotService.create({
            ...req.body,
            user_id: user_id
        });

        SendHTTPResponse({ message: 'chatbot criado', type: 'success', status: true, data: contact, code: HTTPResponseCode.created }, res);
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

        const connection = await ChatbotService.addWorkflow(chatbot_id, {
            name
        });

        SendHTTPResponse(
            { message: 'Workflow criado e vinculado', type: 'success', status: true, data: connection, code: HTTPResponseCode.created },
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
