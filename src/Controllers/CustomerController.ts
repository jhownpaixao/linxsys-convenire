import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest } from '../Core';
import { CustomerService } from '../Services/AppService/CustomerService';
import { UserService } from '../Services/AppService/UserService';

export class CustomerController {
    static store = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        const { nome, contato } = req.body;

        await CheckRequest({ user_id, contato, nome });

        const client = await CustomerService.create({
            ...req.body,
            user_id
        });
        return SendHTTPResponse({ message: 'cliente criado com sucesso', type: 'success', status: true, data: client }, res);
    };

    static list = async (req: Request, res: Response) => {
        const { user_id } = req.params;

        await CheckRequest({ user_id });

        const list = await UserService.listCustomers(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };
}
