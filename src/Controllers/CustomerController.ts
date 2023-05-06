import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, ServerConfig, HTTPResponseCode } from '../Core';
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
        SendHTTPResponse(
            {
                message: 'Cliente criado com sucesso',
                type: 'success',
                status: true,
                location: `/${ServerConfig.ROUTES.client}/${client.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
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

        const contact = await CustomerService.addContact(client_id, {
            value: contato,
            params,
            comments
        });
        SendHTTPResponse(
            {
                message: 'Contato criado e vinculado',
                type: 'success',
                status: true,
                location: `/${ServerConfig.ROUTES.contact}/${contact.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
    };
}
