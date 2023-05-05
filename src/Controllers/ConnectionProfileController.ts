import { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode } from '../Core';
import { ConnectionService, ConnectionProfileService, UserService } from '../Services/AppService';
export class ConnectionProfileController {
    static store = async (req: Request, res: Response) => {
        const { name } = req.body;

        await CheckRequest({ name });

        const profile = await ConnectionProfileService.create(req.body, req.user.id);

        SendHTTPResponse({ message: 'perfil criado', type: 'success', status: true, data: profile, code: HTTPResponseCode.created }, res);
    };

    static get = async (req: Request, res: Response) => {
        const { profile_id } = req.params;

        const profile = await ConnectionProfileService.get(profile_id);

        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: profile }, res);
    };

    static list = async (req: Request, res: Response) => {
        const user = await UserService.get(req.user.id);

        const list = await user.getProfiles();

        SendHTTPResponse({ message: 'Carregado com sucesso', type: 'success', status: true, data: list }, res);
    };

    static addChatbot = async (req: Request, res: Response) => {
        const { profile_id } = req.params;
        const { name } = req.body;

        await CheckRequest({ name });

        const connection = await ConnectionProfileService.addChatbot(profile_id, {
            name
        });

        SendHTTPResponse(
            { message: 'Chatbot criado e vinculado', type: 'success', status: true, data: connection, code: HTTPResponseCode.created },
            res
        );
    };

    static getChatbot = async (req: Request, res: Response) => {
        const { profile_id } = req.params;

        const connection = await ConnectionProfileService.getChatbot(profile_id);
        SendHTTPResponse(
            { message: 'Carregado com sucesso', type: 'success', status: true, data: connection, code: HTTPResponseCode.created },
            res
        );
    };

    static vinculeChatbot = async (req: Request, res: Response) => {
        const { profile_id } = req.params;
        const { chatbot_id } = req.body;

        await CheckRequest({ chatbot_id });

        await ConnectionProfileService.setChatbot(req.user.id, profile_id, chatbot_id);

        SendHTTPResponse({ message: 'chatbot vínculado com sucesso', type: 'success', status: true }, res);
    };
}
