import * as crypto from 'crypto';
import { HTTPResponseCode, TimestampDifference, AppProcessError, Security } from '@core/index';
import { UserModel } from '../sequelize/Models';
import bcrypt from 'bcrypt';
import path from 'path';
import axios from 'axios';
import { InferCreationAttributes } from 'sequelize';
import { AuthConfig, SecurityConfig } from '@core/config';
import { UserService } from './UserService';

declare interface SecurityPendingAuthOptions {
    buffer: Buffer;
    timestamp: number;
    params?: object;
}

type RequestLoginConfirmation = {
    ekm: string;
    edc: string;
};

type RequestLogin = {
    email: string;
    pass: string;
};

export const AuthActiveSessions = new Map<string, InferCreationAttributes<UserModel>>();

export class AuthService {
    static PublicKeyPath = path.join(__dirname, '../keys/public.key.pem');
    static PrivateKeyPath = path.join(__dirname, '../keys/private.key');
    static SecurityPendingAuth = new Map<string, SecurityPendingAuthOptions>();

    static async signData(payload: unknown) {
        const { data } = await axios.post(AuthConfig.AuthJWKSURI + '/sign', payload);
        return data.token;
    }

    static createToken(data: string) {
        const Securitykey = crypto.randomBytes(32);
        const initVector = crypto.randomBytes(SecurityConfig.initialVector);
        const cipher = crypto.createCipheriv(SecurityConfig.AESMethod, Securitykey, initVector);
        let encryptedData = cipher.update(data, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    }

    static createLogin(uniqkey: string): [string, string] {
        const spa = this.SecurityPendingAuth.get(uniqkey);

        if (spa && TimestampDifference(spa.timestamp, Date.now(), 's') < 10) {
            throw new AppProcessError(
                'Este usuário já está realizando login, favor aguardar alguns segundos',
                HTTPResponseCode.informationAlreadyExists
            );
        } else {
            this.SecurityPendingAuth.delete(uniqkey);
        }

        const [encrptKey, buffer] = Security.encrypt(uniqkey);
        this.SecurityPendingAuth.set(uniqkey, {
            buffer,
            timestamp: Date.now()
        });
        return [uniqkey, encrptKey];
    }

    static async validateLogin(data: RequestLoginConfirmation) {
        const AuthData = this.SecurityPendingAuth.get(data.ekm);
        this.SecurityPendingAuth.delete(data.ekm);

        if (!AuthData || !AuthData.buffer || !AuthData.timestamp)
            throw new AppProcessError('Não foi possível realizar o login', HTTPResponseCode.informationUnauthorized);

        if (TimestampDifference(AuthData.timestamp, Date.now(), 's') > 10)
            throw new AppProcessError('Tempo máximo atingido', HTTPResponseCode.informationBlocked);

        const uniqkey = Security.decrypt(data.edc, AuthData.buffer);
        if (!uniqkey) throw new AppProcessError('Não foi possível realizar o login', HTTPResponseCode.informationNotTrue);

        const user = await UserService.getWithFullData({ uniqkey });
        if (!uniqkey) throw new AppProcessError('Não foi possível realizar o login', HTTPResponseCode.informationNotTrue);

        if (AuthActiveSessions.get(user.uniqkey))
            throw new AppProcessError('Este usuário já está logado', HTTPResponseCode.informationBlocked);

        const token = await this.signData({ user });

        if (!token) throw new AppProcessError('Não foi possível criar uma assinatura segura', HTTPResponseCode.iternalErro);

        AuthActiveSessions.set(user.uniqkey, user);
        return {
            user,
            token
        };
    }

    static async login(data: RequestLogin) {
        const foundUser = await UserService.getWithFullData({ email: data.email });
        if (!foundUser) throw new AppProcessError('Email incorreto', HTTPResponseCode.informationNotTrue);

        if (!bcrypt.compareSync(data.pass, foundUser.pass))
            throw new AppProcessError('Senha incorreta', HTTPResponseCode.informationNotTrue);

        return this.createLogin(foundUser.uniqkey);
    }
}
