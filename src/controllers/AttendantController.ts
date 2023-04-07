import { NextFunction, Request, Response } from "express";
import { Controller, SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse, HTTPResponseCode } from "../Core";
import { AttendantModel, UserModel } from "../Models";

export class AttendantController extends Controller<AttendantModel> {
    constructor() { super(AttendantModel); }


    public insert = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const { name, email, pass, block_with_venc, params } = req.body;
        const [check] = await CheckRequest([user_id, name, pass]);
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'error', code: HTTPResponseCode.incompleteRequest }, res);

        const user = await UserModel.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'warning', status: false, code: HTTPResponseCode.informationNotFound }, res)

        try {
            const atnd = await this.Create({
                user_id: parseInt(user_id),
                name,
                email,
                pass,
                block_with_venc,
                params
            });
            return SendHTTPResponse({ message: 'Atendente criado com sucesso', type: 'success', status: true, data: atnd }, res)
        } catch (error) {
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error, res)
        }


    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const attendants: any = await this.Model.findAll();
            if (!attendants) return SendHTTPResponse({ message: 'Atendentes não localizados', type: 'error', status: false, code: HTTPResponseCode.informationNotFound }, res)
            return SendHTTPResponse({ message: 'Solicitação concluída', type: 'success', status: true, data: attendants }, res)
        } catch (error) {
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error, res)
        }

    }


}
