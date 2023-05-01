import { ServerConfig } from './Server';

export class AuthConfig {
    static SecretKey = process.env.SECURITY_JWT_SECRET || 'REVAMER336aexCx000';
    static CookieExpiration = process.env.SECURITY_JWT_COOKIE_EXPIRATION || '90';
    static AuthExpiration = process.env.SECURITY_JWT_EXPIRATION || '1 day';
    static AuthIssuer = `${ServerConfig.HOST_ADDRESS}:${ServerConfig.AUTH_PORT}/LinxSys-EarlyAuth?&version=1.0`;
    static AuthID = process.env.SECURITY_JWT_ID || '32566029';
    static AuthPasspharse = process.env.SECURITY_JWT_PASSPHARSE || 'CryptEARLYENV87';
    static AuthJWKSURI = `${ServerConfig.HOST_ADDRESS}:${ServerConfig.AUTH_PORT}`;
}
