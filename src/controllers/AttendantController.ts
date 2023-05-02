import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest } from '../Core';
import { AttendantService } from '../Services/AppService/AttendantService';
import { UserService } from '../Services/AppService/UserService';

export class AttendantController {
    static store = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        const { name, email, pass, block_with_venc, params } = req.body;

        await CheckRequest({ user_id, name, pass });

        const attendant = await AttendantService.create({
            name,
            email,
            pass,
            block_with_venc,
            params,
            user_id: parseInt(user_id)
        });
        SendHTTPResponse({ message: 'Atendente criado com sucesso', type: 'success', status: true, data: attendant }, res);
    };

    static list = async (req: Request, res: Response) => {
        const { user_id } = req.params;

        await CheckRequest({ user_id });

        const list = await UserService.listAttendants(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };
}
