import type { Request, Response } from 'express';
import { SendHTTPResponse, CheckRequest, HTTPResponseCode, ServerConfig } from '@core';
import { UserService } from '../services/app';

export class UserController {
  static store = async (req: Request, res: Response): Promise<void> => {
    const { name, email, pass, type, block_with_venc, date_venc, params } = req.body;

    await CheckRequest({ name, email, pass, type, block_with_venc });

    const user = await UserService.create({
      name,
      email,
      pass,
      type,
      block_with_venc,
      date_venc,
      params
    });
    SendHTTPResponse(
      {
        message: 'Usuário criado com sucesso',
        type: 'success',
        status: true,
        location: `${ServerConfig.ROUTES.contact}/${user.id}`,
        code: HTTPResponseCode.created
      },
      res
    );
  };

  static list = async (req: Request, res: Response) => {
    const list = await UserService.list();
    SendHTTPResponse(
      { message: 'carregados com sucesso', type: 'success', status: true, data: list },
      res
    );
  };

  static get = async (req: Request, res: Response) => {
    const user_id = req.user.id;

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
    SendHTTPResponse(
      { message: 'Atualizado com sucesso', type: 'success', status: true, data: user },
      res
    );
  };

  static exclude = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    await UserService.delete(user_id);
    SendHTTPResponse({ message: 'Excluído', type: 'success', status: true }, res);
  };
}
