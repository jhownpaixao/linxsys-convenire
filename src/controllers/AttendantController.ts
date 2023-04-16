import { Request, Response } from 'express';
import { Controller, SendHTTPResponse, CheckRequest, ThrowHTTPErrorResponse, HTTPResponseCode, GenereateUniqKey } from '../Core';
import { AttendantModel, Models } from '../Models';

export class AttendantController extends Controller<AttendantModel> {
    constructor() {
        super(AttendantModel);
    }

    public add = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        const { name, email, pass, block_with_venc, params } = req.body;
        /* Check params */
        const [check, need] = await CheckRequest({ user_id, name, pass });
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

        const user = await Models.User.findByPk(user_id);
        if (!user)
            return SendHTTPResponse(
                { message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                res
            );

        const attendant = await user.getAttendants({ where: { email } });
        if (attendant[0])
            return SendHTTPResponse(
                {
                    message: 'Este atendente já está cadastrado',
                    type: 'warning',
                    status: true,
                    code: HTTPResponseCode.informationAlreadyExists
                },
                res
            );

        try {
            const attendant = await user.createAttendant({
                name,
                email,
                uniqkey: GenereateUniqKey(),
                pass,
                block_with_venc,
                params
            });

            if (!attendant)
                return SendHTTPResponse(
                    { message: 'Não foi possível criar o atendente', type: 'error', status: false, code: HTTPResponseCode.iternalErro },
                    res
                );
            return SendHTTPResponse({ message: 'Atendente criado com sucesso', type: 'success', status: true, data: attendant }, res);
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
                include: [Models.User.associations.attendants]
            });

            if (!user)
                return SendHTTPResponse(
                    { message: 'O usuário não foi localizado', type: 'error', status: false, code: HTTPResponseCode.informationNotFound },
                    res
                );

            SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: user.attendants }, res);
        } catch (error) {
            return ThrowHTTPErrorResponse(HTTPResponseCode.iternalErro, error as Error, res);
        }
    };
}
