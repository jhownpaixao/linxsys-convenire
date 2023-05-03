import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode } from '../Core';
import { ConnectionProfileService } from '../Services/AppService/ConnectionProfileService';
import { ConnectionService } from '../Services/AppService/ConnectionService';
import { UserService } from '../Services/AppService/UserService';
export class ConnectionProfileController {
    static store = async (req: Request, res: Response) => {
        const { name } = req.body;

        await CheckRequest({ name });

        const profile = await ConnectionProfileService.create(req.body, req.user.id);

        SendHTTPResponse({ message: 'perfil criada', type: 'success', status: true, data: profile, code: HTTPResponseCode.created }, res);
    };

    static get = async (req: Request, res: Response) => {
        const { connection_id } = req.params;

        const profile = await ConnectionService.getProfile(connection_id);

        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: profile }, res);
    };

    static vincule = async (req: Request, res: Response) => {
        const { connection_id } = req.params;
        const { profile_id } = req.body;

        await ConnectionService.setProfile(req.user.id, connection_id, profile_id);

        SendHTTPResponse({ message: 'perfil vínculado com sucesso', type: 'success', status: true }, res);
    };
}
