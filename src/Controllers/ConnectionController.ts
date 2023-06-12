import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { EnvironmentService, ConnectionService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';
export class ConnectionController {
  static store = async (req: Request, res: Response) => {
    const { client_id } = req.params;
    const { name, type } = req.body;

    await CheckRequest({ name, type });

    const connection = await ConnectionService.create({
      ...req.body,
      client_id: parseInt(client_id),
      env_id: req.env
    });

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.connection,
      EventLogMethod.created
    );

    SendHTTPResponse(
      {
        message: 'Conexão criada com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.connection}/${connection.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static get = async (req: Request, res: Response) => {
    const { connection_id } = req.params;

    const connection = await ConnectionService.get(connection_id);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: connection },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const list = await EnvironmentService.listConnections(req.env);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: list },
      res
    );
  };

  static addProfile = async (req: Request, res: Response) => {
    const { connection_id } = req.params;
    const { name } = req.body;

    await CheckRequest({ name });

    const profile = await ConnectionService.addProfile(connection_id, {
      name
    });

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.connection_profile,
      EventLogMethod.created,
      profile.id
    );

    SendHTTPResponse(
      {
        message: 'Perfil criado e vinculado',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.connection}/${ServerConfig.ROUTES.profile}/${profile.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static getProfile = async (req: Request, res: Response) => {
    const { connection_id } = req.params;

    const connection = await ConnectionService.getProfile(connection_id);
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

  static linkProfile = async (req: Request, res: Response) => {
    const { connection_id } = req.params;
    const { profile_id } = req.body;

    await ConnectionService.setProfile(req.user.id, connection_id, profile_id);

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.connection_profile,
      EventLogMethod.linked,
      { connection_id, profile_id }
    );

    SendHTTPResponse(
      { message: 'perfil vínculado com sucesso', type: 'success', status: true },
      res
    );
  };
}
