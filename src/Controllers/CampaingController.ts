import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { CampaingService, EnvironmentService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';

export class CampaingController {
  static store = async (req: Request, res: Response) => {
    const { params, name } = req.body;

    await CheckRequest({ params, name });

    const campaing = await CampaingService.create({
      ...req.body,
      env_id: req.env
    });

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.campaing,
      EventLogMethod.created,
      campaing.id
    );

    SendHTTPResponse(
      {
        message: 'Campanha criada com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.campaing}/${campaing.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const list = await EnvironmentService.listCampaings(req.env);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: list },
      res
    );
  };
}
