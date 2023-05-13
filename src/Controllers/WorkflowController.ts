import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { WorkflowService, UserService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';

export class WorkflowController {
  static store = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const { name } = req.body;

    await CheckRequest({ name });

    const workflow = await WorkflowService.create({
      ...req.body,
      user_id: user_id
    });

    // ?Registrar o evento
    EventLog.create(req.user.id).register(
      EventLogTarget.workflow,
      EventLogMethod.deleted,
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

  static list = async (req: Request, res: Response) => {
    const user_id = req.user.id;

    const list = await UserService.listWorkflows(user_id);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: list },
      res
    );
  };
}
