import * as crypto from 'crypto'
import { CookieOptions, NextFunction,/*  Request, */ Response } from "express";
import { uuid } from "uuidv4";
import { SecurityOptions, SecurityDecrypt, SecurityEncrypt, CheckRequest, SendHTTPResponse, HTTPResponseCode, TimestampDifference } from '../Core';
import { Models } from '../Models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { generateKeyPairSync } from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import { expressjwt, Request } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

dotenv.config();

declare interface SecurityPendingAuthOptions {
    buffer: Buffer,
    timestamp: number,
    params?: object
}


const host = process.env.BACKEND_URL || 'http://localhost';
const port = process.env.BACKEND_AUTHENTICATOR_PORT || 3302
export class AuthController {
    SecretKey = process.env.SECURITY_JWT_SECRET || 'REVAMER336aexCx000'
    CookieExpiration = process.env.SECURITY_JWT_COOKIE_EXPIRATION || '90'
    AuthExpiration = process.env.SECURITY_JWT_EXPIRATION || '1 day'
    AuthIssuer = `${host}:${port}/LinxSys-EarlyAuth?&version=1.0`
    AuthID = process.env.SECURITY_JWT_ID || '32566029'
    AuthPasspharse = process.env.SECURITY_JWT_PASSPHARSE || 'CryptEARLYENV87'
    AuthJWKSURI = `${host}:${port}/keys`
    GeneratedToken: string = '';
    PublicKeyPath = path.join(__dirname, '../keys/public.key.pem');
    PrivateKeyPath = path.join(__dirname, '../keys/private.key');
    SecurityPendingAuth = new Map<string, SecurityPendingAuthOptions>();


    private generateToken = (data: string) => {
        const Securitykey = crypto.randomBytes(32);
        const initVector = crypto.randomBytes(SecurityOptions.initialVector);
        const cipher = crypto.createCipheriv(SecurityOptions.AESMethod, Securitykey, initVector);
        let encryptedData = cipher.update(data, "utf-8", "hex");
        encryptedData += cipher.final("hex");
        return encryptedData
    }

    public createAuthRequest = async (uniqkey: string): Promise<[string, string]> => {
        const [encrptKey, buffer] = await SecurityEncrypt(uniqkey)
        const key = this.generateToken(uuid());
        if (this.SecurityPendingAuth)
            this.SecurityPendingAuth.set(key, {
                buffer,
                timestamp: Date.now()
            });
        return [key, encrptKey]
    }

    public validateAuthRequest = async (req: Request, res: Response, next: NextFunction) => {
        /* EncodedKeyMap | EncondedDataCompare */
        const { ekm, edc } = req.params;

        const [check, need] = await CheckRequest({ ekm, edc });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, data: { need }, type: 'warning', code: HTTPResponseCode.incompleteRequest }, res);

        const AuthData = this.SecurityPendingAuth.get(ekm);
        this.SecurityPendingAuth.delete(ekm);
        if (!AuthData || !AuthData.buffer || !AuthData.timestamp)
            return SendHTTPResponse({ message: 'Não foi possível realizar o login', status: false, type: 'error', code: HTTPResponseCode.informationNotTrue }, res);

        if (TimestampDifference(AuthData.timestamp, Date.now(), 's') > 10)
            return SendHTTPResponse({ message: 'Tempo máximo atingido', status: false, type: 'error', code: HTTPResponseCode.informationBlocked }, res);

        const uniqkey = await SecurityDecrypt(edc, AuthData.buffer);

        if (!uniqkey)
            return SendHTTPResponse({ message: 'Não foi possível realizar o login', status: false, type: 'error', code: HTTPResponseCode.informationUnauthorized }, res);


        const user = await Models.User.findOne({
            where: {
                uniqkey
            },
            attributes: [
                'id',
                'name',
                'email',
                'uniqkey',
                'type',
                'group_id',
                'date_venc',
                'params'
            ]
        });

        if (!user)
            return SendHTTPResponse({ message: 'Não foi possível realizar o login', status: false, type: 'error', code: HTTPResponseCode.informationNotFound }, res);
        console.log(this.SecretKey);
        const token = await this.sign({ user });

        if (!token) {
            return SendHTTPResponse({ message: 'Não foi possível criar uma assinatura segura', status: false, type: 'error', code: HTTPResponseCode.iternalErro }, res);
        }
        const options: CookieOptions = {
            maxAge: 1000 * 60 * 60 * 24, // 24hour
            httpOnly: true, // The cookie only accessible by the web server
            signed: true, // Indicates if the cookie should be signed
            secure: true,
            sameSite: 'strict',
            domain: host
        }
        res.cookie('SIGNED_EDC', 'PASSED_ONLY', options);
        return SendHTTPResponse({ message: 'logado com sucesso', status: true, data: { token, user }, type: 'success' }, res);
    }

    public initLogin = async (req: Request, res: Response, next: NextFunction) => {
        const { email, pass } = req.body;

        const [check, need] = await CheckRequest({ email, pass });
        if (!check) return SendHTTPResponse({ message: 'Requisição incompleta', status: false, data: { need }, type: 'warning', code: HTTPResponseCode.incompleteRequest }, res);

        const foundUser = await Models.User.findOne({ where: { email } });
        if (!foundUser) return SendHTTPResponse({ message: 'Email incorreto', status: false, type: 'warning', code: HTTPResponseCode.informationNotFound }, res);

        const isMatch = bcrypt.compareSync(pass, foundUser.pass)
        if (!isMatch) return SendHTTPResponse({ message: 'Senha incorreta', status: false, type: 'warning', code: HTTPResponseCode.informationNotTrue }, res);

        const [key, encrypted] = await this.createAuthRequest(foundUser.uniqkey);

        return SendHTTPResponse({ message: 'Confirmar autorização', status: false, type: 'warning', data: { ekm: key, edc: encrypted, confirmation: `/auth/validate/${key}/${encrypted}` }, code: HTTPResponseCode.accepted }, res);

        //res.redirect(HTTPResponseCode.redirectingForResponse, `/auth/validate/${key}/${encrypted}`);
    }

    public authorization = expressjwt({
        // @ts-ignore
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: this.AuthJWKSURI
        }),
        issuer: this.AuthIssuer,
        algorithms: ['RS256']
    });

    public createKeys = async (req: Request, res: Response, next: NextFunction) => {
        await this.generateKeys();
        return SendHTTPResponse({ message: 'Chaves geradas', status: true, type: 'success' }, res);
    }

    public generateKeys = async () => {
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: this.AuthPasspharse
            }
        });
        await fs.writeFile(this.PrivateKeyPath, privateKey);
        await fs.writeFile(this.PublicKeyPath, publicKey);
    }

    public signData = async (req: Request, res: Response, next: NextFunction) => {
        const privateKey = await fs.readFile(this.PrivateKeyPath);
        const token = await this.sign(req.body);
        return SendHTTPResponse({ message: 'Signed', status: true, type: 'success' }, res);
    }

    public sign = async (payload: any) => {

        if (!existsSync(this.PrivateKeyPath)) return false;

        const privateKey = await fs.readFile(this.PrivateKeyPath);
        const token = jwt.sign(payload, {
            key: privateKey,
            passphrase: this.AuthPasspharse
        }, {
            algorithm: 'RS256',
            expiresIn: this.AuthExpiration,
            issuer: this.AuthIssuer,
            keyid: this.AuthID,
        });
        return token;
    }

    public verifyData = async (req: Request, res: Response, next: NextFunction) => {
        try {


            const publicKey = await fs.readFile(this.PublicKeyPath);

            const decodedToken = jwt.verify(req.body.token, publicKey, {
                issuer: this.AuthIssuer,
                algorithms: ['RS256'],
                maxAge: this.AuthExpiration
            });
            console.log(`Decoded token data`, decodedToken);
            return SendHTTPResponse({ message: 'Verified', status: true, data: { decodedToken }, type: 'success' }, res);
        } catch (error) {

        }
    }

}
