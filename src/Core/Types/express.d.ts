import { NextFunction } from 'express';
import type {
  AuthMiddlewareProps,
  UserAuthMiddlewareProps
} from '../../middlewares/AuthMiddleware';
declare global {
  namespace Express {
    export interface Request {
      user: UserAuthMiddlewareProps;
      auth: AuthMiddlewareProps;
      env: number;
    }
    export type MiddlewareFunction = (req: Request, res: Response, next?: NextFunction) => void;
  }
}
