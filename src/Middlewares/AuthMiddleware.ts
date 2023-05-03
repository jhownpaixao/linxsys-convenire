import { expressjwt } from 'express-jwt';
import { AuthConfig } from '../Core/Config/Auth';
import jwksRsa from 'jwks-rsa';

export type UserAuthMiddlewareProps = {
    id: number;
    name: string;
    email: string;
    uniqkey: string;
    type: string;
    group_id: number | null;
    date_venc: string;
    params: object | null;
};

export type AuthMiddlewareProps = {
    exp: number;
    iat: number;
    iss: string;
    user: UserAuthMiddlewareProps;
};
export class AuthMiddleware {
    static Authorization = expressjwt({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: AuthConfig.AuthJWKSURI + '/keys'
        }),
        issuer: AuthConfig.AuthIssuer,
        algorithms: ['RS256']
    });
}
