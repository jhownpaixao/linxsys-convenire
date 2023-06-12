import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { EnvironmentService, ChatbotService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';

export class ChatbotController {
  static store = async (req: Request, res: Response) => {
    const { name } = req.body;

    await CheckRequest({ name });

    const chatbot = await ChatbotService.create({
      ...req.body,
      env_id: req.env
    });

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.attendant,
      EventLogMethod.created,
      chatbot.id
    );

    SendHTTPResponse(
      {
        message: 'Chatbot criado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.chatbot}/${chatbot.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const list = await EnvironmentService.listChatbots(req.env);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: list },
      res
    );
  };

  static addWorkflow = async (req: Request, res: Response) => {
    const { chatbot_id } = req.params;
    const { name } = req.body;

    await CheckRequest({ name });

    const workflow = await ChatbotService.addWorkflow(chatbot_id, {
      name
    });

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.workflow,
      EventLogMethod.created,
      workflow.id
    );
    SendHTTPResponse(
      {
        message: 'Workflow criado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.workflow}/${workflow.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static getWorkflow = async (req: Request, res: Response) => {
    const { chatbot_id } = req.params;
    const connection = await ChatbotService.getWorkflow(chatbot_id);

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

  static linkWorkflow = async (req: Request, res: Response) => {
    const { chatbot_id } = req.params;
    const { workflow_id } = req.body;

    await CheckRequest({ workflow_id });

    await ChatbotService.setWorkflow(req.user.id, chatbot_id, workflow_id);

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.workflow,
      EventLogMethod.linked,
      {
        chatbot_id,
        workflow_id
      }
    );

    SendHTTPResponse(
      { message: 'Workflow vínculado com sucesso', type: 'success', status: true },
      res
    );
  };
}
