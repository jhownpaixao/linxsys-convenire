import { NextFunction, Request, Response } from 'express';
import { AppProcessError, CheckRequest, HTTPResponseCode } from '../Core';
import { UserService } from '../Services/AppService/UserService';
import { AuthMiddlewareProps } from './AuthMiddleware';
import { UserType } from '../Core/Types/User';

export class UserMiddleware {
    static Authorization = (level = 1) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = await this.authObjectValidate(req.auth);

            const userLvl = parseInt(UserType[user.type]);
            if (userLvl > level) throw new AppProcessError('Nível de acesso incompatível', HTTPResponseCode.informationBlocked);

            req.user = user;
            return next();
        };
    };
    static check = async (req: Request, res: Response, next: NextFunction) => {
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

    static AccessLvl = (level: number) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) throw new AppProcessError('Nível de acesso não encontrado', HTTPResponseCode.informationNotFound);
            const userLvl = UserType[req.user.type] as unknown as number;
            if (userLvl > level) throw new AppProcessError('Nível de acesso incompatível', HTTPResponseCode.informationBlocked);
            return next();
        };
    };
}
