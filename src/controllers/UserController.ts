import { NextFunction, Request, Response } from "express";
import { Controller, SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse, HTTPResponseCode, logger } from "../Core";
import { UserModel, Models } from "../Models";
import { Op } from "sequelize";

export class UserController extends Controller<UserModel> {
    constructor() { super(UserModel); }

    public insert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { name, email, pass, type, block_with_venc, date_venc, params } = req.body;
        const [check] = await CheckRequest({ name, pass, type, block_with_venc });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'error', code: HTTPResponseCode.incompleteRequest }, res);

        const user = await this.Model.findOne({
            where: { email: email }
        })
        if (user) return SendHTTPResponse({ message: 'Este email já está cadastrado', type: 'warning', status: true, code: HTTPResponseCode.informationAlreadyExists }, res)
        try {
            const user = await this.Create({
                name,
                email,
                pass,
                type,
                block_with_venc,
                date_venc,
                params
            });
            return SendHTTPResponse({ message: 'Usuário criado com sucesso', type: 'success', status: true, data: user, code: HTTPResponseCode.registeredInformation }, res)
        } catch (error) {
            return ThrowHTTPErrorResponse(500, error, res)
        }
    }
    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        const list = await this.List();
        SendHTTPResponse({ message: 'carregados com sucesso', type: 'success', status: true, data: list }, res)
    }

    public Get = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const [check] = await CheckRequest({ user_id });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'error', code: HTTPResponseCode.incompleteRequest }, res);

        const user = await this.Model.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false }, res)

        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user }, res)
    }

    public addAttendant = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const { name, email, pass, block_with_venc, params } = req.body;
        /* Check params */
        const [check, need] = await CheckRequest({ user_id, name, pass });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', data: { need }, code: HTTPResponseCode.incompleteRequest }, res);

        const user = await this.Model.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)


        let attendant = await Models.Attendant.findOne({ where: { email: email, user_id: user_id } })
        if (attendant) return SendHTTPResponse({ message: 'Este atendente já está cadastrado', type: 'warning', status: true, code: HTTPResponseCode.informationAlreadyExists }, res)

        try {
            const attendant = await user.createAttendant({
                name,
                email,
                pass,
                block_with_venc,
                params
            })

            if (!attendant) return SendHTTPResponse({ message: 'Não foi possível criar o atendente', type: 'error', status: false, code: HTTPResponseCode.iternalErro }, res)


            return SendHTTPResponse({ message: 'Atendente criado com sucesso', type: 'success', status: true, data: attendant }, res)
        } catch (error) {
            return ThrowHTTPErrorResponse(500, error, res)
        }


    }
    public addClient = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const {
            nome,
            nascimento,
            email,
            cpf,
            contato,
            rg,
            cep,
            end,
            end_num,
            bairro,
            cidade,
            uf,
            group_id,
            params
        } = req.body;

        /* Check params */
        const [check, need] = await CheckRequest({ user_id, nome, contato });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', data: { need }, code: HTTPResponseCode.incompleteRequest }, res);

        /* Check user */
        const user = await this.ResolveModel(user_id)
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'warning', status: false, code: HTTPResponseCode.informationNotFound }, res)

        const contact = await Models.Contact.findOne({ where: { value: contato } })
        if (contact) return SendHTTPResponse({ message: 'Este contato já está em uso', type: 'warning', status: true, code: HTTPResponseCode.informationAlreadyExists }, res)

        let conditions = [];

        if (rg) conditions.push({ rg });
        if (cpf) conditions.push({ cpf });
        if (email) conditions.push({ email });

        /* Check client */
        if (conditions.length > 0) {
            const client = await Models.Client.findOne({
                where: {
                    [Op.and]: [
                        { user_id },
                        {
                            [Op.or]: conditions
                        }
                    ]
                }
            })

            if (client) return SendHTTPResponse({ message: 'Este cliente já está cadastrado', type: 'warning', status: true, code: 409 }, res)
        }




        try {
            const client = await user.createClient({
                nome,
                nascimento,
                email,
                cpf,
                rg,
                cep,
                end,
                end_num,
                bairro,
                cidade,
                uf,
                group_id,
                params
            })

            if (!client) return SendHTTPResponse({ message: 'Não foi possível criar o cliente', type: 'error', status: false, code: HTTPResponseCode.iternalErro }, res)

            const contact = client.createContact({
                value: contato
            })

            if (!contact) return SendHTTPResponse({ message: 'O cliente foi criado, mas não foi possível adicionar o contato', type: 'warning', status: false, code: HTTPResponseCode.partiallyCompletedProcess }, res)

            return SendHTTPResponse({ message: 'cliente criado com sucesso', type: 'success', status: true, data: client }, res)
        } catch (error) {
            return ThrowHTTPErrorResponse(500, error, res)
        }


    }
    public addConnection = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const { name, comments, type, params } = req.body;
        const [check, need] = await CheckRequest({ user_id, type });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', data: { need }, code: HTTPResponseCode.incompleteRequest }, res);

        const user = await this.Model.findByPk(user_id);
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
            logger.fatal({ connection })
            if (!connection) return SendHTTPResponse({ message: 'Não foi possível criar a conexão', type: 'error', status: false, code: HTTPResponseCode.iternalErro }, res)

            const config = await connection.createConfig({
                name: `Config for ${connection.name}`
            })
            if (!config) return SendHTTPResponse({ message: 'A conexão foi criada, mas não foi possível adicionar as configurações', type: 'error', status: false, code: HTTPResponseCode.partiallyCompletedProcess }, res)

            return SendHTTPResponse({ message: 'Conexão criada com sucesso', type: 'success', status: true, data: { connection, config } }, res)
        } catch (error) {
            console.log(error)

            return ThrowHTTPErrorResponse(500, error, res)
        }


    }


    public getAttendants = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const [check, need] = await CheckRequest({ user_id });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', data: { need }, code: HTTPResponseCode.incompleteRequest }, res);

        try {
            const user = await this.Model.findByPk(user_id, {
                include: [this.Model.associations.attendants],
            });

            if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)

            SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user.attendants! }, res)

        } catch (error) {
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error, res)
        }

    }
    public getClients = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const [check, need] = await CheckRequest({ user_id });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', data: { need }, code: HTTPResponseCode.incompleteRequest }, res);

        try {
            const user = await this.Model.findByPk(user_id, {
                include: [this.Model.associations.clients]
            });
            if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)
            SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user.clients! }, res)

        } catch (error) {
            console.log(error);
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error, res)
        }
    }
    public getConnections = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const [check, need] = await CheckRequest({ user_id });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', data: { need }, code: HTTPResponseCode.incompleteRequest }, res);

        try {
            const user = await this.Model.findByPk(user_id, {
                include: [this.Model.associations.connections]
            });

            if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)
            SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user.connections! }, res)

        } catch (error) {
            console.log(error);
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error, res)
        }
    }

}
