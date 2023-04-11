import { NextFunction, Request, Response } from "express";
import { Controller, SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse, HTTPResponseCode, logger, GenereateUniqKey } from "../Core";
import { UserModel, Models } from "../Models";
import { Op } from "sequelize";
import bcrypt from 'bcrypt';

export class UserController extends Controller<UserModel> {
    constructor() { super(UserModel); }

    public insert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { name, email, pass, type, block_with_venc, date_venc, params } = req.body;
        const [check, need] = await CheckRequest({ name, pass, type, block_with_venc });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, data: { need }, type: 'error', code: HTTPResponseCode.incompleteRequest }, res);

        const user = await this.Model.findOne({
            where: { email: email }
        })
        if (user) return SendHTTPResponse({ message: 'Este email já está cadastrado', type: 'warning', status: true, code: HTTPResponseCode.informationAlreadyExists }, res)

        const hash = await bcrypt.hash(pass, 10)

        try {
            const user = await this.Create({
                name,
                uniqkey: GenereateUniqKey(),
                email,
                pass: hash,
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




}
