import { AuthMiddlewareProps, UserAuthMiddlewareProps } from '../../Middlewares/AuthMiddleware';
declare global {
    namespace Express {
        export interface Request {
            user: UserAuthMiddlewareProps;
            auth: AuthMiddlewareProps;
        }
    }
}
