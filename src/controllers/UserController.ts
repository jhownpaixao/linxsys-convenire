import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { UserService } from '../services/app';
import { EventLog, EventLogMethod, EventLogTarget } from '../services/app/Event';
import type { User } from '../services/sequelize/Models/User';

export class UserController {
  static store = async (req: Request, res: Response): Promise<void> => {
    const { name, email, pass, type, block_with_venc, date_venc, ...rest } = req.body;

    await CheckRequest({ name, email, pass, type, block_with_venc, date_venc });

    const user = await UserService.create({
      name,
      email,
      pass,
      type,
      block_with_venc,
      date_venc,
      ...rest
    });

    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.user,
      EventLogMethod.created,
      user.id
    );

    SendHTTPResponse(
      {
        message: 'Usuário criado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.user}/${user.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const { type } = req.query;
    let list: User[] = [];

    if (type) {
      list = await UserService.listWith({ type: type as string });
    } else {
      list = await UserService.list();
    }

    SendHTTPResponse(
      { message: 'carregados com sucesso', type: 'success', status: true, data: list },
      res
    );
  };

  static get = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    const user = await UserService.get(user_id);
    SendHTTPResponse(
      { message: 'Carregado com sucesso', type: 'success', status: true, data: user },
      res
    );
  };

  static update = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const params = req.body;

    const user = await UserService.update(user_id, params);

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.user,
      EventLogMethod.updated,
      user.id
    );

    SendHTTPResponse(
      {
        message: 'Atualizado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.user}/${user.id}`
      },
      res
    );
  };

  static exclude = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    await UserService.delete(user_id);

    // ?Registrar o evento
    EventLog.create(req.user.uniqkey, req.env).register(
      EventLogTarget.user,
      EventLogMethod.deleted,
      user_id
    );

    SendHTTPResponse({ message: 'Excluído', type: 'success', status: true }, res);
  };
}
