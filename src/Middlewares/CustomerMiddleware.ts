import { NextFunction, Request, Response } from 'express';
import { AppProcessError, CheckRequest, HTTPResponseCode } from '@Core';
import { UserService } from '../Services/App/UserService';
import { CustomerService } from '../Services/App/CustomerService';

export class CustomerMiddleware {
    static check = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = req.user.id;
        const { client_id } = req.params;

        await CheckRequest({ client_id });
        await CustomerService.get(client_id);

        if (!(await UserService.hasCustomer(user_id, client_id)))
            throw new AppProcessError('O cliente não pertence à este usuário', HTTPResponseCode.informationBlocked);

        return next();
    };
}
