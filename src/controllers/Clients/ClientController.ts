import { Request, Response } from 'express';
import { Controller, SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse, HTTPResponseCode } from '../../Core';
import { ClientModel, Models } from '../../Models';
import { Op } from 'sequelize';

export class ClientController extends Controller<ClientModel> {
    constructor() {
        super(ClientModel);
    }

    public add = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        const { nome, nascimento, email, cpf, contato, rg, cep, end, end_num, bairro, cidade, uf, group_id, params } = req.body;

        /* Check params */
        const [check, need] = await CheckRequest({ user_id, nome, contato });
        if (!check)
            return SendHTTPResponse(
                {
                    message: 'Requisição incompleta',
                    status: false,
                    type: 'warning',
                    data: { need },
                    code: HTTPResponseCode.incompleteRequest
                },
                res
            );

        /* Check user */
        const user = await Models.User.findByPk(user_id);
        if (!user)
            return SendHTTPResponse(
                { message: 'O usuário não foi localizado', type: 'warning', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );

        const contact = await user.getContacts({ where: { value: contato } });
        if (contact[0])
            return SendHTTPResponse(
                { message: 'Este contato já está em uso', type: 'warning', status: true, code: HTTPResponseCode.informationAlreadyExists },
                res
            );

        const conditions = [];

        if (rg) conditions.push({ rg });
        if (cpf) conditions.push({ cpf });
        if (email) conditions.push({ email });

        /* Check client */
        if (conditions.length > 0) {
            const client = await user.getClients({
                where: {
                    [Op.and]: [
                        { user_id },
                        {
                            [Op.or]: conditions
                        }
                    ]
                }
            });

            if (client[0])
                return SendHTTPResponse({ message: 'Este cliente já está cadastrado', type: 'warning', status: true, code: 409 }, res);
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
            });

            if (!client)
                return SendHTTPResponse(
                    { message: 'Não foi possível criar o cliente', type: 'error', status: false, code: HTTPResponseCode.iternalErro },
                    res
                );

            const contact = await client.getContacts({ where: { value: contato } }); //Search results in Client
            if (contact[0])
                return SendHTTPResponse(
                    {
                        message: 'este contato já está em uso',
                        type: 'error',
                        status: false,
                        code: HTTPResponseCode.informationAlreadyExists
                    },
                    res
                );

            const contact_c = client.createContact({
                value: contato,
                user_id: user.id
            });

            if (!contact_c)
                return SendHTTPResponse(
                    {
                        message: 'O cliente foi criado, mas não foi possível adicionar o contato',
                        type: 'warning',
                        status: false,
                        code: HTTPResponseCode.partiallyCompletedProcess
                    },
                    res
                );

            return SendHTTPResponse({ message: 'cliente criado com sucesso', type: 'success', status: true, data: client }, res);
        } catch (error) {
            return ThrowHTTPErrorResponse(500, error as Error, res);
        }
    };

    public getAll = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        const [check, need] = await CheckRequest({ user_id });
        if (!check)
            return SendHTTPResponse(
                {
                    message: 'Requisição incompleta',
                    status: false,
                    type: 'warning',
                    data: { need },
                    code: HTTPResponseCode.incompleteRequest
                },
                res
            );

        try {
            const user = await Models.User.findByPk(user_id, {
                include: [Models.User.associations.clients]
            });
            if (!user)
                return SendHTTPResponse(
                    { message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                    res
                );
            SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user.clients }, res);
        } catch (error) {
            console.log(error);
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error as Error, res);
        }
    };

    public addContact = async (req: Request, res: Response) => {
        const { user_id, client_id } = req.params;
        const { contato, params, comments } = req.body;

        const [check] = await CheckRequest({ user_id, client_id, contato });
        if (!check)
            return SendHTTPResponse(
                { message: 'Requisição incompleta', status: false, type: 'warning', code: HTTPResponseCode.incompleteRequest },
                res
            );

        const user = await Models.User.findByPk(user_id); /* Use 'any' for type, in case to use propetys of the model */
        if (!user)
            return SendHTTPResponse(
                { message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );
        const client = await this.Model.findByPk(client_id);
        if (!client)
            return SendHTTPResponse(
                { message: 'O client não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );
        const contact = await client.getContacts({ where: { value: contato } }); //Search results in Client
        /* const contact = await Models.Contact.findOne({ where: { value: contato } }) */ //Search all results Contacts
        if (contact[0])
            return SendHTTPResponse(
                { message: 'este contato já está em uso', type: 'error', status: false, code: HTTPResponseCode.informationAlreadyExists },
                res
            );
        try {
            const contact = await client.createContact({
                value: contato,
                user_id: user.id,
                params,
                comments
            });

            if (!contact)
                return SendHTTPResponse(
                    {
                        message: 'Não foi possível criar o contato',
                        type: 'error',
                        status: false,
                        code: HTTPResponseCode.informationNotFound
                    },
                    res
                );

            return SendHTTPResponse({ message: 'Contato criado com sucesso', type: 'success', status: true, data: contact }, res);
        } catch (error) {
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error as Error, res);
        }
    };

    public getContacts = async (req: Request, res: Response) => {
        const { user_id, client_id } = req.params;

        const [check] = await CheckRequest({ user_id, client_id });
        if (!check)
            return SendHTTPResponse(
                { message: 'Requisição incompleta', status: false, type: 'warning', code: HTTPResponseCode.incompleteRequest },
                res
            );

        const user = await Models.User.findByPk(user_id);
        if (!user)
            return SendHTTPResponse(
                { message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );

        try {
            const client = await this.Model.findByPk(client_id, {
                include: [this.Model.associations.contacts]
            });
            if (!client)
                return SendHTTPResponse(
                    { message: 'O client não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                    res
                );
            return SendHTTPResponse({ message: 'contatos carregados', type: 'success', status: true, data: client.contacts }, res);
        } catch (error) {
            console.log('error', error);
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error as Error, res);
        }
    };
}
