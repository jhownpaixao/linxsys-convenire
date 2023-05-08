import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@Core';
import { AssessmentService, UserService } from '../Services/App';

export class AssessmentController {
    static store = async (req: Request, res: Response) => {
        const user_id = req.user.id;
        const { client_id, contact_id, for_id } = req.body;

        await CheckRequest({ client_id, contact_id, for_id });

        const assessment = await AssessmentService.create({
            ...req.body,
            user_id: user_id
        });
        SendHTTPResponse(
            {
                message: 'Avaliação criada com sucesso',
                type: 'success',
                status: true,
                location: `${ServerConfig.ROUTES.assessment}/${assessment.id}`,
                code: HTTPResponseCode.created
            },
            res
        );
    };

    static list = async (req: Request, res: Response) => {
        const user_id = req.user.id;

        const list = await UserService.listAssessments(user_id);
        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };
}
