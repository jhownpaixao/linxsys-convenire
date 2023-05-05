import { NextFunction, Request, Response } from 'express';
import { AppProcessError, CheckRequest, HTTPResponseCode } from '../Core';
import { UserService } from '../Services/AppService/UserService';
import { AuthMiddlewareProps } from './AuthMiddleware';

export class UserMiddleware {
    static recover = async (req: Request, res: Response, next: NextFunction) => {
        const user = await this.authObjectValidate(req.auth);

        req.user = user;
        return next();
    };

    static checkinparam = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;

        await CheckRequest({ user_id });

        return next();
    };

    private static async authObjectValidate(auth: AuthMiddlewareProps) {
        if (!auth) throw new AppProcessError('Autorização não encontrada', HTTPResponseCode.informationUnauthorized);

        const user = auth.user;
        if (!user) throw new AppProcessError('Autorização inválida', HTTPResponseCode.informationUnauthorized);

        const chu = await UserService.getWith({
            uniqkey: user.uniqkey,
            id: user.id,
            email: user.email
        });
        if (!chu) throw new AppProcessError('Credencial adulterada', HTTPResponseCode.informationBlocked);
        return user;
    }
}
