import { NextFunction, Request, Response } from 'express';
import { CheckRequest } from '../Core';
import { UserService } from '../Services/AppService/UserService';

export class UserMiddleware {
    static check = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.params;

        await CheckRequest({ user_id });
        await UserService.get(user_id);

        return next();
    };
}
