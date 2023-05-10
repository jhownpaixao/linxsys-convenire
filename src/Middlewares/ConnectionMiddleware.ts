import type { NextFunction, Request, Response } from 'express';
import { AppProcessError, CheckRequest, HTTPResponseCode } from '@core';
import { ConnectionProfileService, ConnectionService, UserService } from '../services/app';

export class ConnectionMiddleware {
  static check = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user.id;
    const { connection_id } = req.params;

    await CheckRequest({ connection_id });
    await ConnectionService.get(connection_id);

    if (!(await UserService.hasConnection(user_id, connection_id)))
      throw new AppProcessError(
        'A conexão não pertence à este usuário',
        HTTPResponseCode.informationBlocked
      );

    return next();
  };

  static checkProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user.id;
    const { profile_id } = req.params;

    await CheckRequest({ profile_id });
    await ConnectionProfileService.get(profile_id);

    if (!(await UserService.hasProfile(user_id, profile_id)))
      throw new AppProcessError(
        'O perfil de conexão não pertence à este usuário',
        HTTPResponseCode.informationBlocked
      );

    return next();
  };
}
