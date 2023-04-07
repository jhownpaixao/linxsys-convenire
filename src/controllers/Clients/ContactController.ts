import { NextFunction, Request, Response } from "express";
import { Controller, SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse, HTTPResponseCode } from "../../Core";
import { InferCreationAttributes } from 'sequelize';
import { ContactModel } from "../../Models";

export class ContactController extends Controller<ContactModel> {
    constructor() { super(ContactModel); }

    public RequestAdd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { client_id } = req.params;
        const { value, comments, params } = req.body;
        const [check] = await CheckRequest([value, client_id]);
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'error', code: HTTPResponseCode.incompleteRequest }, res);

        const contact = await this.Add({
            client_id: parseInt(client_id),
            value,
            comments,
            params
        });

        if (contact) {
            return SendHTTPResponse({ message: 'contato criado', type: 'success', status: true, data: contact, code: 201 }, res)
        }
        return SendHTTPResponse({ message: 'não foi possível criar o contato', type: 'error', status: false, code: 203 }, res)

    }

    public Add = async (data: InferCreationAttributes<ContactModel>) => {

        try {
            const contact = await this.Create(data);
            return contact
        } catch (error) {
            return false
        }
    }

}
