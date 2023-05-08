import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { UserService, ConnectionService } from '../services/app';
export class ConnectionController {
    static store = async (req: Request, res: Response) => {
        const user_id = req.user.id;
        const { client_id } = req.params;
        const { name, type } = req.body;

        await CheckRequest({ name, type });

        const connection = await ConnectionService.create({
            ...req.body,
            client_id: parseInt(client_id),
            user_id: user_id
        });

        SendHTTPResponse(
            {
                message: 'Conexão criada com sucesso',
                type: 'success',
                status: true,
                location: `${ServerConfig.ROUTES.connection}/${connection.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
    };

    static list = async (req: Request, res: Response) => {
        const user_id = req.user.id;

        const list = await UserService.listConnections(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };

    static addProfile = async (req: Request, res: Response) => {
        const { connection_id } = req.params;
        const { name } = req.body;

        await CheckRequest({ name });

        const profile = await ConnectionService.addProfile(connection_id, {
            name
        });

        SendHTTPResponse(
            {
                message: 'Perfil criado e vinculado',
                type: 'success',
                status: true,
                location: `${ServerConfig.ROUTES.connection}/${ServerConfig.ROUTES.profile}/${profile.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
    };

    static getProfile = async (req: Request, res: Response) => {
        const { connection_id } = req.params;

        const connection = await ConnectionService.getProfile(connection_id);
        SendHTTPResponse(
            { message: 'Carregado com sucesso', type: 'success', status: true, data: connection, code: HTTPResponseCode.created },
            res
        );
    };

    static vinculeProfile = async (req: Request, res: Response) => {
        const { connection_id } = req.params;
        const { profile_id } = req.body;

        await ConnectionService.setProfile(req.user.id, connection_id, profile_id);

        SendHTTPResponse({ message: 'perfil vínculado com sucesso', type: 'success', status: true }, res);
    };
}
