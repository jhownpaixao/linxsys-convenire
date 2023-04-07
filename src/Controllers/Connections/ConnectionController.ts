import { NextFunction, Request, Response } from "express";
import { Controller, SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse, HTTPResponseCode } from "../../Core";
import { Models, ConnectionModel } from "../../Models";

export class ConnectionController extends Controller<ConnectionModel> {
    constructor() { super(ConnectionModel); }

    public add = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const { name, comments, type, params } = req.body;
        const [check, need] = await CheckRequest({ user_id, type });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', data: { need }, code: HTTPResponseCode.incompleteRequest }, res);

        const user = await Models.User.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)


        let connection = await Models.Connection.findOne({ where: { name, user_id } })
        if (connection) return SendHTTPResponse({ message: 'Esta conexão já esta registrada', type: 'warning', status: true, code: HTTPResponseCode.informationAlreadyExists }, res)

        try {
            const connection = await user.createConnection({
                name,
                comments,
                params,
                type
            })
            if (!connection) return SendHTTPResponse({ message: 'Não foi possível criar a conexão', type: 'error', status: false, code: HTTPResponseCode.iternalErro }, res)

            const config = await connection.createConfig({
                name: `Configuration for ${connection.name}`
            })
            if (!config) return SendHTTPResponse({ message: 'A conexão foi criada, mas não foi possível adicionar as configurações', type: 'error', status: false, code: HTTPResponseCode.partiallyCompletedProcess }, res)

            return SendHTTPResponse({ message: 'Conexão criada com sucesso', type: 'success', status: true, data: { connection, config } }, res)
        } catch (error) {
            console.log(error)

            return ThrowHTTPErrorResponse(500, error, res)
        }


    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const [check, need] = await CheckRequest({ user_id });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', data: { need }, code: HTTPResponseCode.incompleteRequest }, res);

        try {
            const user = await Models.User.findByPk(user_id, {
                include: [Models.User.associations.connections]
            });

            if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)
            SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user.connections! }, res)

        } catch (error) {
            console.log(error);
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error, res)
        }
    }



    public editConfig = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id, connection_id } = req.params;
        const { name, chatbot_id, default_messages, queues, params, comments } = req.body;

        const [check, need] = await CheckRequest({ user_id, connection_id, name });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', data: { need }, status: false, type: 'warning', code: HTTPResponseCode.incompleteRequest }, res);

        const user = await Models.User.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)

        const connection = await user.getConnections({ where: { id: connection_id } });
        if (!user) return SendHTTPResponse({ message: 'A conexão não foi encontrada', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)


        const config = await connection[0].getConfig();
        if (!config) return SendHTTPResponse({ message: 'Não foi possível localizar a configuração desta conexão', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)

        const edited = await config.update({
            name,
            chatbot_id,
            default_messages,
            queues,
            params,
            comments
        })

        return SendHTTPResponse({ message: 'configuração salvas', type: 'success', status: true, data: edited }, res)

    }

    public getConfig = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id, connection_id } = req.params;

        const [check, need] = await CheckRequest({ user_id, connection_id });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', data: { need }, code: HTTPResponseCode.incompleteRequest }, res);

        const user = await Models.User.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)

        const connection = await user.getConnections({ where: { id: connection_id } });
        if (!user) return SendHTTPResponse({ message: 'A conexão não foi encontrada', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)


        const config = await connection[0].getConfig();
        if (!config) return SendHTTPResponse({ message: 'Não foi possível localizar a configuração desta conexão', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)

        return SendHTTPResponse({ message: 'configuração carregada', type: 'success', status: true, data: config }, res)

    }

}
