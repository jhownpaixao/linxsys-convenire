import type { NextFunction, Request, Response } from 'express';
import { AppProcessError, CheckRequest, HTTPResponseCode } from '@core';
import { ChatbotService, EnvironmentService } from '../services/app';

export class ChatbotMiddleware {
  static check = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user.id;
    const { chatbot_id } = req.params;

    await CheckRequest({ chatbot_id });
    await ChatbotService.get(chatbot_id);

    if (!(await EnvironmentService.hasChatbot(user_id, chatbot_id)))
      throw new AppProcessError(
        'O chatbot não pertence à este usuário',
        HTTPResponseCode.informationBlocked
      );

    return next();
  };
}
