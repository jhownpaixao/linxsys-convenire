import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { EnvironmentService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';

export class EnvironmentController {
  static store = async (req: Request, res: Response): Promise<void> => {
    const { name, block_with_venc, date_venc } = req.body;
    await CheckRequest({ name, block_with_venc, date_venc });

    const env = await EnvironmentService.create(req.body);

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.environment,
      EventLogMethod.created,
      env.id
    );

    SendHTTPResponse(
      {
        message: 'Ambiente criado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.environment}/${env.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const list = await EnvironmentService.list();

    SendHTTPResponse(
      { message: 'carregados com sucesso', type: 'success', status: true, data: list },
      res
    );
  };

  static get = async (req: Request, res: Response) => {
    const { env_id } = req.params;
    const user = await EnvironmentService.get(env_id);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: user },
      res
    );
  };

  static update = async (req: Request, res: Response) => {
    const { env_id } = req.params;
    const { admins, ...rest } = req.body;

    const env = await EnvironmentService.update(env_id, rest, admins);

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.environment,
      EventLogMethod.updated,
      env.id
    );

    SendHTTPResponse(
      {
        message: 'Atualizado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.environment}/${env.id}`
      },
      res
    );
  };

  static exclude = async (req: Request, res: Response) => {
    const { env_id } = req.params;

    await EnvironmentService.delete(env_id);

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.environment,
      EventLogMethod.deleted,
      env_id
    );

    SendHTTPResponse({ message: 'Excluído', type: 'success', status: true }, res);
  };

  static sign = async (req: Request, res: Response) => {
    const { env_id } = req.body;
    const env = await EnvironmentService.sign(env_id, req.user);

    SendHTTPResponse(
      {
        message: 'Logado no ambiente com sucesso',
        type: 'success',
        status: true,
        data: env
      },
      res
    );
  };
}
