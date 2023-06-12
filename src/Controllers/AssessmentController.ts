import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { AssessmentService, EnvironmentService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';

export class AssessmentController {
  static store = async (req: Request, res: Response) => {
    const { client_id, contact_id, for_id } = req.body;

    await CheckRequest({ client_id, contact_id, for_id });

    const assessment = await AssessmentService.create({
      ...req.body,
      env_id: req.env
    });

    EventLog.create(req.user.uniqkey).register(
      EventLogTarget.assessment,
      EventLogMethod.created,
      assessment
    );

    SendHTTPResponse(
      {
        message: 'Avaliação criada com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.assessment}/${assessment.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const list = await EnvironmentService.listAssessments(req.env);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: list },
      res
    );
  };
}
