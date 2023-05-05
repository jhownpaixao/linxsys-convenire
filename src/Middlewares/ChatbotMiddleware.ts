import { NextFunction, Request, Response } from 'express';
import { AppProcessError, CheckRequest, HTTPResponseCode } from '../Core';
import { ChatbotService, UserService } from '../Services/AppService';

export class ChatbotMiddleware {
    static check = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = req.user.id;
        const { chatbot_id } = req.params;

        await CheckRequest({ chatbot_id });
        await ChatbotService.get(chatbot_id);

        if (!(await UserService.hasChatbot(user_id, chatbot_id)))
            throw new AppProcessError('O chatbot não pertence à este usuário', HTTPResponseCode.informationBlocked);

        return next();
    };
}
