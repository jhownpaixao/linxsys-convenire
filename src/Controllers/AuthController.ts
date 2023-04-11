import * as crypto from 'crypto'
import { NextFunction, Request, Response } from "express";
import { uuid } from "uuidv4";
import { SecurityOptions, SecurityDecrypt, SecurityEncrypt, CheckRequest, SendHTTPResponse, HTTPResponseCode, TimestampDifference } from '../Core';
import { Models } from '../Models';
import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UserModel } from '../Models';
import { InferCreationAttributes } from 'sequelize';
import { generateKeyPairSync } from 'crypto';
import { dirname, join } from 'path';
import { writeFileSync, readFileSync } from 'fs';
dotenv.config();

declare interface SecurityPendingAuthOptions {
    buffer: Buffer,
    timestamp: number,
    params?: object
}

declare interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export class AuthController {
    SecretKey = process.env.SECURITY_JWT_SECRET || 'REVAMER336aexCx000'
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
        const token = jwt.sign({ user }, this.SecretKey, {
            expiresIn: '1 days',
        });
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
    public authorization = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');


            if (!token) return SendHTTPResponse({ message: 'Autorização não foi encontrada', status: false, type: 'error', data: { need: { header: 'Authorization' } }, code: HTTPResponseCode.informationUnauthorized }, res);

            const decoded = jwt.verify(token, this.SecretKey);
            (req as CustomRequest).token = decoded;
            next();

        } catch (err) {
            return SendHTTPResponse({ message: 'Autorização inválida', status: false, type: 'error', code: HTTPResponseCode.informationUnauthorized }, res);

        }
    }

    public createKeys = async (req: Request, res: Response, next: NextFunction) => {
        await this.generateKeys();
        return SendHTTPResponse({ message: 'Chaves geradas', status: true, type: 'success' }, res);
    }
    public authenticateToken = async (token: string, User: typeof UserModel) => {
        //const decoded: InferCreationAttributes<UserModel> = jwt.verify(token, this.SecretKey);

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
                passphrase: '2209'
            }
        });
        writeFileSync('../keys/private.key', privateKey,);
        writeFileSync(join('keys', 'public.key.pem'), publicKey);
    }

    public signData = async (payload: any) => {
        const privateKey = readFileSync(join('keys', '.private.key'));
        const token = jwt.sign(payload, {
            key: privateKey,
            passphrase: '2209'
        }, {
            algorithm: 'RS256',
            expiresIn: '1 day',
            issuer: '333333',
            keyid: '220994'
        });
        writeFileSync(join('keys', 'token.txt'), token);
    }

    public verifyData = async (payload: any) => {
        const token = readFileSync(join('keys', 'token.txt')).toString();
        const publicKey = readFileSync(join('keys', '.public.key.pem'));
        const decodedToken = jwt.verify(token, publicKey, {
            issuer: '333333',
            algorithms: ['RS256'],
            maxAge: '1 day'
        });
        console.log(`Decoded token data`, decodedToken);

    }

}
