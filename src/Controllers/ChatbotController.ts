import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode } from '../Core';
import { CustomerService } from '../Services/AppService/CustomerService';
import { ChatbotService } from '../Services/AppService/ChatbotService';
import { UserService } from '../Services/AppService/UserService';

export class ChatbotController {
    static store = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        const { name } = req.body;

        await CheckRequest({ name });

        const contact = await ChatbotService.create({
            ...req.body,
            user_id: parseInt(user_id)
        });

        SendHTTPResponse({ message: 'chatbot criado', type: 'success', status: true, data: contact, code: HTTPResponseCode.created }, res);
    };

    static list = async (req: Request, res: Response) => {
        const { user_id } = req.params;

        const list = await UserService.listChatbots(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };
}
