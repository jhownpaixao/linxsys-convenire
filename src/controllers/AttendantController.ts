import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { EnvironmentService, AttendantService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';
export class AttendantController {
  static store = async (req: Request, res: Response) => {
    const { name, email, pass, block_with_venc, params } = req.body;

    await CheckRequest({ name, pass });
    const attendant = await AttendantService.create({
      name,
      email,
      pass,
      block_with_venc,
      params,
      env_id: req.env
    });

    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.attendant,
      EventLogMethod.created,
      attendant.id
    );

    SendHTTPResponse(
      {
        message: 'Atendente criado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.attendant}/${attendant.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const list = await EnvironmentService.listAttendants(req.env);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: list },
      res
    );
  };
}
