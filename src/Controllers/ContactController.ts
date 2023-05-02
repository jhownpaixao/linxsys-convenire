import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest } from '../Core';
import { CustomerService } from '../Services/AppService/CustomerService';
import { ContactService } from '../Services/AppService/ContactService';

export class ContactController {
    static store = async (req: Request, res: Response) => {
        const { client_id, user_id } = req.params;
        const { value, comments, params } = req.body;

        await CheckRequest({ value });

        const contact = await ContactService.create({
            value,
            comments,
            params,
            client_id: parseInt(client_id),
            user_id: parseInt(user_id)
        });

        SendHTTPResponse({ message: 'contato criado', type: 'success', status: true, data: contact, code: 201 }, res);
    };

    static list = async (req: Request, res: Response) => {
        const { client_id } = req.params;

        const list = await CustomerService.listContacts(client_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };
}
