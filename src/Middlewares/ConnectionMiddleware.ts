import { NextFunction, Request, Response } from 'express';
import { AppProcessError, CheckRequest, HTTPResponseCode } from '../Core';
import { ConnectionService, UserService } from '../Services/AppService';

export class ConnectionMiddleware {
    static check = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = req.user.id;
        const { connection_id } = req.params;

        await CheckRequest({ connection_id });
        await ConnectionService.get(connection_id);

        if (!(await UserService.hasConnection(user_id, connection_id)))
            throw new AppProcessError('A conexão não pertence à este usuário', HTTPResponseCode.informationBlocked);

        return next();
    };
}
