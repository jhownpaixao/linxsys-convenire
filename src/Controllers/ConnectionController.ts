import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse, HTTPResponseCode, GenereateUniqKey } from '../Core';
import { Models } from '../Services/Sequelize/Models';
import { ConnectionService } from '../Services/AppService/ConnectionService';
import { UserService } from '../Services/AppService/UserService';
export class ConnectionController {
    static store = async (req: Request, res: Response) => {
        const { client_id, user_id } = req.params;
        const { name, comments, type, params } = req.body;

        await CheckRequest([name, type]);

        const connection = await ConnectionService.create({
            ...req.body,
            client_id: parseInt(client_id),
            user_id: parseInt(user_id)
        });

        SendHTTPResponse(
            { message: 'conexão criada', type: 'success', status: true, data: connection, code: HTTPResponseCode.created },
            res
        );
    };

    static list = async (req: Request, res: Response) => {
        const { user_id } = req.params;

        await CheckRequest({ user_id });

        const list = await UserService.listConnections(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };

    public add = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        const { name, comments, type, params } = req.body;
        await CheckRequest({ user_id, type });

        const user = await Models.User.findByPk(user_id);
        if (!user)
            return SendHTTPResponse(
                { message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );

        const connection = await Models.Connection.findOne({ where: { name, user_id } });
        if (connection)
            return SendHTTPResponse(
                {
                    message: 'Esta conexão já esta registrada',
                    type: 'warning',
                    status: true,
                    code: HTTPResponseCode.informationAlreadyExists
                },
                res
            );

        try {
            const connection = await user.createConnection({
                name,
                comments,
                uniqkey: GenereateUniqKey(),
                params,
                type
            });
            if (!connection)
                return SendHTTPResponse(
                    { message: 'Não foi possível criar a conexão', type: 'error', status: false, code: HTTPResponseCode.iternalErro },
                    res
                );

            const config = await connection.createProfile({
                name: `Configuration for ${connection.name}`
            });
            if (!config)
                return SendHTTPResponse(
                    {
                        message: 'A conexão foi criada, mas não foi possível adicionar as configurações',
                        type: 'error',
                        status: false,
                        code: HTTPResponseCode.partiallyCompletedProcess
                    },
                    res
                );

            return SendHTTPResponse(
                { message: 'Conexão criada com sucesso', type: 'success', status: true, data: { connection, config } },
                res
            );
        } catch (error) {
            console.log(error);

            return ThrowHTTPErrorResponse(500, error as Error, res);
        }
    };

    public getAll = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        await CheckRequest({ user_id });

        try {
            const user = await Models.User.findByPk(user_id, {
                include: [Models.User.associations.connections]
            });

            if (!user)
                return SendHTTPResponse(
                    { message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                    res
                );
            SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user.connections }, res);
        } catch (error) {
            console.log(error);
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error as Error, res);
        }
    };

    public editConfig = async (req: Request, res: Response) => {
        const { user_id, connection_id } = req.params;
        const { name, chatbot_id, default_messages, queues, params, comments } = req.body;

        await CheckRequest({ user_id, connection_id, name });

        const user = await Models.User.findByPk(user_id);
        if (!user)
            return SendHTTPResponse(
                { message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );

        const connection = await user.getConnections({ where: { id: connection_id } });
        if (!user)
            return SendHTTPResponse(
                { message: 'A conexão não foi encontrada', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );

        const config = await connection[0].getProfile();
        if (!config)
            return SendHTTPResponse(
                {
                    message: 'Não foi possível localizar a configuração desta conexão',
                    type: 'error',
                    status: false,
                    code: HTTPResponseCode.informationNotFound
                },
                res
            );

        const edited = await config.update({
            name,
            chatbot_id,
            default_messages,
            queues,
            params,
            comments
        });

        return SendHTTPResponse({ message: 'configuração salvas', type: 'success', status: true, data: edited }, res);
    };

    public getConfig = async (req: Request, res: Response) => {
        const { user_id, connection_id } = req.params;

        await CheckRequest({ user_id, connection_id });

        const user = await Models.User.findByPk(user_id);
        if (!user)
            return SendHTTPResponse(
                { message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );

        const connection = await user.getConnections({ where: { id: connection_id } });
        if (!user)
            return SendHTTPResponse(
                { message: 'A conexão não foi encontrada', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );

        const config = await connection[0].getProfile();
        if (!config)
            return SendHTTPResponse(
                {
                    message: 'Não foi possível localizar a configuração desta conexão',
                    type: 'error',
                    status: false,
                    code: HTTPResponseCode.informationNotFound
                },
                res
            );

        return SendHTTPResponse({ message: 'configuração carregada', type: 'success', status: true, data: config }, res);
    };
}
