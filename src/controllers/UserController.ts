import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode } from '../Core';
import { UserService } from '../Services';

const service = new UserService();

export class UserController {
    static store = async (req: Request, res: Response): Promise<void> => {
        const { name, email, pass, type, block_with_venc, date_venc, params } = req.body;

        await CheckRequest({ name, email, pass, type, block_with_venc });

        const user = await service.create({
            name,
            email,
            pass,
            type,
            block_with_venc,
            date_venc,
            params
        });

        SendHTTPResponse(
            {
                message: 'Usuário criado com sucesso',
                type: 'success',
                status: true,
                data: user,
                code: HTTPResponseCode.registeredInformation
            },
            res
        );
    };

    static list = async (req: Request, res: Response) => {
        const list = await service.list();
        SendHTTPResponse({ message: 'carregados com sucesso', type: 'success', status: true, data: list }, res);
    };

    static get = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        await CheckRequest({ user_id });

        const user = await service.get(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user }, res);
    };
}
