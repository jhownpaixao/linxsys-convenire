import { NextFunction, Request, Response } from "express";
import { Controller, SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse, HTTPResponseCode } from "../../Core";
import { ClientModel, ContactModel, Models } from "../../Models";

export class ClientController extends Controller<ClientModel> {
    constructor() { super(ClientModel); }

    public addContact = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id, client_id, params, comments } = req.params;
        const { contato } = req.body;

        const [check] = await CheckRequest({ user_id, client_id, contato });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', code: HTTPResponseCode.incompleteRequest }, res);

        const user = await Models.User.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)

        const client = await this.Model.findByPk(client_id);
        if (!client) return SendHTTPResponse({ message: 'O client não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)

        const contact = await Models.Contact.findOne({ where: { value: contato } })
        if (!contact) return SendHTTPResponse({ message: 'este contato já está em uso', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)

        try {
            const contact = await client.createContact({
                value: contato
            })

            if (!contact) return SendHTTPResponse({ message: 'Não foi possível criar o contato', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)


            return SendHTTPResponse({ message: 'Contato criado com sucesso', type: 'success', status: true, data: contact }, res)
        } catch (error) {
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error, res)
        }


    }

    public getContacts = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id, client_id } = req.params;

        const [check] = await CheckRequest({ user_id, client_id });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'warning', code: HTTPResponseCode.incompleteRequest }, res);

        const user = await Models.User.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)

        try {
            const client = await this.Model.findByPk(client_id, {
                include: [this.Model.associations.contacts]
            });
            if (!client) return SendHTTPResponse({ message: 'O client não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)
            return SendHTTPResponse({ message: 'contatos carregados', type: 'success', status: true, data: client.contacts }, res)
        } catch (error) {
            console.log('error', error);
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error, res)
        }
    }

}
