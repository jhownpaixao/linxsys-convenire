import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { ConnectionProfileService, EnvironmentService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';
export class ConnectionProfileController {
  static store = async (req: Request, res: Response) => {
    const { name } = req.body;

    await CheckRequest({ name });

    const profile = await ConnectionProfileService.create(req.body, req.user.id);

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.connection_profile,
      EventLogMethod.created,
      profile.id
    );

    SendHTTPResponse(
      {
        message: 'Perfil criado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.connection}/${ServerConfig.ROUTES.profile}/${profile.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static get = async (req: Request, res: Response) => {
    const { profile_id } = req.params;

    const profile = await ConnectionProfileService.get(profile_id);

    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: profile },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const user = await EnvironmentService.get(req.env);

    const list = await user.getProfiles();

    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: list },
      res
    );
  };

  static addChatbot = async (req: Request, res: Response) => {
    const { profile_id } = req.params;
    const { name } = req.body;

    await CheckRequest({ name });

    const chatbot = await ConnectionProfileService.addChatbot(profile_id, {
      name
    });

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.chatbot,
      EventLogMethod.created,
      chatbot.id
    );

    SendHTTPResponse(
      {
        message: 'Chatbot criado e vinculado',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.connection}/${ServerConfig.ROUTES.profile}/${chatbot.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static getChatbot = async (req: Request, res: Response) => {
    const { profile_id } = req.params;

    const connection = await ConnectionProfileService.getChatbot(profile_id);
    SendHTTPResponse(
      {
        message: 'Carregado com sucesso',
        type: 'success',
        status: true,
        data: connection,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static linkChatbot = async (req: Request, res: Response) => {
    const { profile_id } = req.params;
    const { chatbot_id } = req.body;

    await CheckRequest({ chatbot_id });

    await ConnectionProfileService.setChatbot(req.user.id, profile_id, chatbot_id);

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.chatbot,
      EventLogMethod.created,
      {
        profile_id,
        chatbot_id
      }
    );

    SendHTTPResponse(
      { message: 'chatbot vínculado com sucesso', type: 'success', status: true },
      res
    );
  };
}
