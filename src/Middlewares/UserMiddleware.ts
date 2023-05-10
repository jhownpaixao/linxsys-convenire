import type { NextFunction, Request, Response } from 'express';
import { AppProcessError, CheckRequest, HTTPResponseCode } from '@core';
import { UserService } from '../services/app/UserService';
import type { AuthMiddlewareProps } from './AuthMiddleware';
import { Security } from '@core';
export class UserMiddleware {
  static recover = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.extractUserFromRequest(req.auth);

    Security.requestAccessPermission(user, req);

    req.user = user;
    return next();
  };

  static check = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;
    await CheckRequest({ user_id });
    return next();
  };

  private static async extractUserFromRequest(auth: AuthMiddlewareProps) {
    if (!auth)
      throw new AppProcessError(
        'Autorização não encontrada',
        HTTPResponseCode.informationUnauthorized
      );

    const user = auth.user;
    if (!user)
      throw new AppProcessError('Autorização inválida', HTTPResponseCode.informationUnauthorized);

    const ch_u = await UserService.getWith({
      uniqkey: user.uniqkey,
      id: user.id,
      email: user.email
    });
    if (!ch_u)
      throw new AppProcessError('Credencial adulterada', HTTPResponseCode.informationBlocked);
    return user;
  }
}
