import { expressjwt } from 'express-jwt';
import { AuthConfig } from '../Core/Config/Auth';
import jwksRsa from 'jwks-rsa';
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
