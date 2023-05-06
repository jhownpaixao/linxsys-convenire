import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, ServerConfig, HTTPResponseCode } from '../Core';
import { ContactService, CustomerService } from '../Services/AppService';

export class ContactController {
    static store = async (req: Request, res: Response) => {
        const user_id = req.user.id;
        const { client_id } = req.params;
        const { value, comments, params } = req.body;

        await CheckRequest({ value });

        const contact = await ContactService.create({
            value,
            comments,
            params,
            client_id: parseInt(client_id),
            user_id: user_id
        });

        SendHTTPResponse(
            {
                message: 'Contato criado com sucesso',
                type: 'success',
                status: true,
                location: `/${ServerConfig.ROUTES.contact}/${contact.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
    };

    static list = async (req: Request, res: Response) => {
        const { client_id } = req.params;

        const list = await CustomerService.listContacts(client_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };
}
