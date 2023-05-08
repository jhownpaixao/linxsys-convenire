import { AuthMiddlewareProps, UserAuthMiddlewareProps } from '../../middlewares/AuthMiddleware';
declare global {
    namespace Express {
        export interface Request {
            user: UserAuthMiddlewareProps;
            auth: AuthMiddlewareProps;
        }
    }
}
