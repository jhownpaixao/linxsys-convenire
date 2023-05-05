import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest } from '../Core';
import { UserService, CustomerService } from '../Services/AppService';

export class CustomerController {
    static store = async (req: Request, res: Response) => {
        const user_id = req.user.id;
        const { nome, contato } = req.body;

        await CheckRequest({ contato, nome });

        const client = await CustomerService.create({
            ...req.body,
            user_id
        });
        return SendHTTPResponse({ message: 'cliente criado com sucesso', type: 'success', status: true, data: client }, res);
    };

    static list = async (req: Request, res: Response) => {
        const user_id = req.user.id;

        const list = await UserService.listCustomers(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };

    static contacts = async (req: Request, res: Response) => {
        const { client_id } = req.params;

        const contacts = await CustomerService.listContacts(client_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: contacts }, res);
    };

    static addContact = async (req: Request, res: Response) => {
        const { client_id } = req.params;
        const { contato, params, comments } = req.body;

        await CheckRequest({ contato });

        const contacts = await CustomerService.addContact(client_id, {
            value: contato,
            params,
            comments
        });
        SendHTTPResponse({ message: 'Adicionado com sucesso', type: 'success', status: true, data: contacts }, res);
    };
}
