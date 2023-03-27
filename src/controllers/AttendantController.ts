import { NextFunction, Request, Response } from "express";
import Controller from "./BaseController";
import { Attendant } from "../Models";
import { SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse } from "../Utils/Responses";

export default class AttendantController extends Controller<Attendant> {
    constructor() { super(Attendant); }


    public Insert = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const { name, email, pass, block_with_venc, data } = req.body;
        const [check] = await CheckRequest([user_id, name, pass]);
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'error', code: 400 }, res);

        const user = await this.Model.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'warning', status: false, code: 204 }, res)

        try {
            const atnd = await this.Create({
                user_id: parseInt(user_id),
                name,
                email,
                pass,
                block_with_venc,
                data
            });
            return SendHTTPResponse({ message: 'Atendente criado com sucesso', type: 'success', status: true, data: atnd }, res)
        } catch (error) {
            return ThrowHTTPErrorResponse(500, error, res)
        }


    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const attendants: any = await this.Model.findAll();
            if (!attendants) return SendHTTPResponse({ message: 'Atendentes não localizados', type: 'error', status: false, code: 204 }, res)
            return SendHTTPResponse({ message: 'Solicitação concluída', type: 'success', status: true, data: attendants }, res)
        } catch (error) {
            return ThrowHTTPErrorResponse(500, error, res)
        }

    }


}
