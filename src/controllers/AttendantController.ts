import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@Core';
import { UserService, AttendantService } from '../Services/AppService';

export class AttendantController {
    static store = async (req: Request, res: Response) => {
        const user_id = req.user.id;
        const { name, email, pass, block_with_venc, params } = req.body;

        await CheckRequest({ name, pass });

        const attendant = await AttendantService.create({
            name,
            email,
            pass,
            block_with_venc,
            params,
            user_id: user_id
        });
        SendHTTPResponse(
            {
                message: 'Atendente criado com sucesso',
                type: 'success',
                status: true,
                location: `${ServerConfig.ROUTES.attendant}/${attendant.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
    };

    static list = async (req: Request, res: Response) => {
        const user_id = req.user.id;

        await CheckRequest({ user_id });

        const list = await UserService.listAttendants(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };
}
