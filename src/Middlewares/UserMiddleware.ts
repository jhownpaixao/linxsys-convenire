import { NextFunction, Request, Response } from 'express';
import { AppProcessError, CheckRequest, HTTPResponseCode } from '../Core';
import { UserService } from '../Services/AppService/UserService';
import { AuthMiddlewareProps } from './AuthMiddleware';

export class UserMiddleware {
    static recover = async (req: Request, res: Response, next: NextFunction) => {
        const user = await this.authObjectValidate(req.auth);

        await this.userValidate(user.id);
        req.user = user;
        return next();
    };

    static checkinparam = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;

        await CheckRequest({ user_id });
        await this.userValidate(user_id);

        return next();
    };

    private static async userValidate(id: number | string) {
        await UserService.get(id);
    }

    private static async authObjectValidate(auth: AuthMiddlewareProps) {
        if (!auth) throw new AppProcessError('Autorização não encontrada', HTTPResponseCode.informationUnauthorized);

        const user = auth.user;
        if (!user) throw new AppProcessError('Usuário não consta na autorização', HTTPResponseCode.informationUnauthorized);

        return user;
    }
}
