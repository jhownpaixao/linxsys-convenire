import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { ChatService, EnvironmentService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';

export class ChatController {
  static store = async (req: Request, res: Response) => {
    const { owner_id, type } = req.body;

    await CheckRequest({ owner_id, type });

    const chat = await ChatService.create({
      ...req.body,
      env_id: req.env
    });

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.chatbot,
      EventLogMethod.created,
      chat.id
    );

    SendHTTPResponse(
      {
        message: 'Chat criado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.chat}/${chat.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const list = await EnvironmentService.listChats(req.env);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: list },
      res
    );
  };
}
