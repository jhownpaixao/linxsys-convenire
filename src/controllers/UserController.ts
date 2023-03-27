import { NextFunction, Request, Response } from "express";
import Controller from "./BaseController";
import { User } from "../Models";
import { SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse } from "../Utils/Responses";
export default class UserController extends Controller<User> {
    constructor() { super(User); }

    public Insert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { name, email, pass, type, block_with_venc, date_venc, data } = req.body;
        const [check] = await CheckRequest([name, pass, type, block_with_venc]);
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'error', code: 400 }, res);

        try {
            const user = await this.Create({
                name,
                email,
                pass,
                type,
                block_with_venc,
                date_venc,
                data
            });
            return SendHTTPResponse({ message: 'Usuário criado com sucesso', type: 'success', status: true, data: user, code: 201 }, res)
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
        const [check] = await CheckRequest([user_id]);
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'error', code: 400 }, res);

        const user = await this.Model.findByPk(user_id);
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false }, res)

        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user }, res)
    }

    public GetAttendants = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;
        const [check] = await CheckRequest([user_id]);
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, type: 'error', code: 400 }, res);

        const user: any = await this.Model.findByPk(user_id, {
            include: { association: 'attendants' }
        });
        if (!user) return SendHTTPResponse({ message: 'O usuário não foi localizado', type: 'error', status: false, code: 203 }, res)

        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user.attendants }, res)
    }

}
