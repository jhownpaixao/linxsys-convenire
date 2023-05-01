import { Request, Response } from 'express';
import { Controller, SendHTTPResponse, CheckRequest, HTTPResponseCode } from '../../Core';
import { InferCreationAttributes } from 'sequelize';
import { ContactModel } from '../../Services/Sequelize/Models';

export class ContactController extends Controller<ContactModel> {
    constructor() {
        super(ContactModel);
    }

    public RequestAdd = async (req: Request, res: Response): Promise<void> => {
        const { client_id, user_id } = req.params;
        const { value, comments, params } = req.body;
        await CheckRequest([value, client_id]);

        const contact = await this.Add({
            client_id: parseInt(client_id),
            user_id: parseInt(user_id),
            value,
            comments,
            params
        });

        if (contact) {
            return SendHTTPResponse({ message: 'contato criado', type: 'success', status: true, data: contact, code: 201 }, res);
        }
        return SendHTTPResponse({ message: 'não foi possível criar o contato', type: 'error', status: false, code: 203 }, res);
    };

    public Add = async (data: InferCreationAttributes<ContactModel>) => {
        try {
            const contact = await this.Create(data);
            return contact;
        } catch (error) {
            return false;
        }
    };
}
