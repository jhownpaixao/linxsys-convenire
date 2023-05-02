import * as crypto from 'crypto';
import { CookieOptions, Response, Request } from 'express';
import { uuid } from 'uuidv4';
import {
    SecurityOptions,
    SecurityDecrypt,
    SecurityEncrypt,
    CheckRequest,
    SendHTTPResponse,
    HTTPResponseCode,
    TimestampDifference
} from '../Core';
import { Models, UserModel } from '../Services/Sequelize/Models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import jwktopem from 'jwk-to-pem';
import { InferCreationAttributes } from 'sequelize';
import { AuthConfig } from '../Core/Config/Auth';
dotenv.config();

declare interface SecurityPendingAuthOptions {
    buffer: Buffer;
    timestamp: number;
    params?: object;
}

export const ActiveSession = new Map<string, InferCreationAttributes<UserModel>>();
export class AuthController {
    static GeneratedToken = '';
    static PublicKeyPath = path.join(__dirname, '../keys/public.key.pem');
    static PrivateKeyPath = path.join(__dirname, '../keys/private.key');
    static SecurityPendingAuth = new Map<string, SecurityPendingAuthOptions>();

    private static generateToken = (data: string) => {
        const Securitykey = crypto.randomBytes(32);
        const initVector = crypto.randomBytes(SecurityOptions.initialVector);
        const cipher = crypto.createCipheriv(SecurityOptions.AESMethod, Securitykey, initVector);
        let encryptedData = cipher.update(data, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    };

    public static createAuthRequest = async (uniqkey: string): Promise<[string, string]> => {
        const [encrptKey, buffer] = await SecurityEncrypt(uniqkey);
        const key = this.generateToken(uuid());
        if (this.SecurityPendingAuth)
            this.SecurityPendingAuth.set(key, {
                buffer,
                timestamp: Date.now()
            });
        return [key, encrptKey];
    };

    public static validateAuthRequest = async (req: Request, res: Response) => {
        /* EncodedKeyMap | EncondedDataCompare */
        const { ekm, edc } = req.params;

        await CheckRequest({ ekm, edc });

        const AuthData = this.SecurityPendingAuth.get(ekm);
        this.SecurityPendingAuth.delete(ekm);
        if (!AuthData || !AuthData.buffer || !AuthData.timestamp)
            return SendHTTPResponse(
                { message: 'Não foi possível realizar o login', status: false, type: 'error', code: HTTPResponseCode.informationNotTrue },
                res
            );

        if (TimestampDifference(AuthData.timestamp, Date.now(), 's') > 10)
            return SendHTTPResponse(
                { message: 'Tempo máximo atingido', status: false, type: 'error', code: HTTPResponseCode.informationBlocked },
                res
            );

        const uniqkey = await SecurityDecrypt(edc, AuthData.buffer);

        if (!uniqkey)
            return SendHTTPResponse(
                {
                    message: 'Não foi possível realizar o login',
                    status: false,
                    type: 'error',
                    code: HTTPResponseCode.informationUnauthorized
                },
                res
            );

        const user = await Models.User.findOne({
            where: {
                uniqkey
            },
            attributes: ['id', 'name', 'email', 'uniqkey', 'type', 'group_id', 'date_venc', 'params']
        });

        if (!user)
            return SendHTTPResponse(
                { message: 'Não foi possível realizar o login', status: false, type: 'error', code: HTTPResponseCode.informationNotFound },
                res
            );
        const token = await this.sign({ user });

        if (!token) {
            return SendHTTPResponse(
                {
                    message: 'Não foi possível criar uma assinatura segura',
                    status: false,
                    type: 'error',
                    code: HTTPResponseCode.iternalErro
                },
                res
            );
        }
        const options: CookieOptions = {
            maxAge: 1000 * 60 * 60 * 24, // 24hour
            httpOnly: true, // The cookie only accessible by the web server
            signed: true, // Indicates if the cookie should be signed
            secure: true,
            sameSite: 'strict'
        };
        res.cookie('SIGNED_EDC', 'PASSED_ONLY', options);

        ActiveSession.set(user.uniqkey, user);
        return SendHTTPResponse({ message: 'logado com sucesso', status: true, data: { token, user }, type: 'success' }, res);
    };

    public static initLogin = async (req: Request, res: Response) => {
        const { email, pass } = req.body;

        await CheckRequest({ email, pass });

        const foundUser = await Models.User.findOne({ where: { email } });
        if (!foundUser)
            return SendHTTPResponse(
                { message: 'Email incorreto', status: false, type: 'warning', code: HTTPResponseCode.informationNotFound },
                res
            );

        const isMatch = bcrypt.compareSync(pass, foundUser.pass);
        if (!isMatch)
            return SendHTTPResponse(
                { message: 'Senha incorreta', status: false, type: 'warning', code: HTTPResponseCode.informationNotTrue },
                res
            );

        const [key, encrypted] = await this.createAuthRequest(foundUser.uniqkey);

        return SendHTTPResponse(
            {
                message: 'Confirmar autorização',
                status: false,
                type: 'warning',
                data: { ekm: key, edc: encrypted, confirmation: `/auth/validate/${key}/${encrypted}` },
                code: HTTPResponseCode.accepted
            },
            res
        );

        //res.redirect(HTTPResponseCode.redirectingForResponse, `/auth/validate/${key}/${encrypted}`);
    };

    public static signData = async (req: Request, res: Response) => {
        const token = await this.sign(req.body);
        return SendHTTPResponse({ message: 'Signed', status: true, type: 'success', data: { token } }, res);
    };

    public static sign = async (payload: unknown) => {
        const { data } = await axios.post(AuthConfig.AuthJWKSURI + '/sign', payload);
        return data.token;
    };

    public static verifyData = async (req: Request, res: Response) => {
        const { token } = req.body;
        const { data } = await axios.get(AuthConfig.AuthJWKSURI + '/keys');
        const [firstKey] = data.keys;
        const publicKey = jwktopem(firstKey);
        try {
            const decoded = jwt.verify(token, publicKey);
            res.send(decoded);
        } catch (e) {
            res.send({ error: e });
        }
    };
}
