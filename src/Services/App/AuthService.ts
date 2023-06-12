import * as crypto from 'crypto';
import { HTTPResponseCode, TimestampDifference, AppProcessError, Security } from '@core/index';
import type { UserModel } from '../sequelize/Models';
import bcrypt from 'bcrypt';
import path from 'path';
import axios from 'axios';
import type { InferCreationAttributes } from 'sequelize';
import { AuthConfig, SecurityConfig } from '@core/config';
import { UserService } from './UserService';
import type { UserAuthMiddlewareProps } from '../../middlewares';

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

type Session = {
  token: string;
};
export const AuthActiveSessions = new Map<string, InferCreationAttributes<UserModel> & Session>();

export class AuthService {
  static PublicKeyPath = path.join(__dirname, '../keys/public.key.pem');
  static PrivateKeyPath = path.join(__dirname, '../keys/private.key');
  static SecurityPendingAuth = new Map<string, SecurityPendingAuthOptions>();

  static async signData(payload: unknown) {
    const { data } = await axios.post(AuthConfig.AuthJWKSURI + '/auth/sign', payload);
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

  static createLogin(uniqkey: string): [string, string, boolean] {
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
    const isLoged = !!AuthActiveSessions.get(uniqkey);
    return [uniqkey, encrptKey, isLoged];
  }

  static deleteLogin(uniqkey: string) {
    this.SecurityPendingAuth.delete(uniqkey);
    AuthActiveSessions.delete(uniqkey);
  }

  static async validateLogin(data: RequestLoginConfirmation) {
    const AuthData = this.SecurityPendingAuth.get(data.ekm);
    this.SecurityPendingAuth.delete(data.ekm);

    if (!AuthData || !AuthData.buffer || !AuthData.timestamp)
      throw new AppProcessError(
        'Não foi possível realizar o login',
        HTTPResponseCode.informationUnauthorized
      );

    if (TimestampDifference(AuthData.timestamp, Date.now(), 's') > 10)
      throw new AppProcessError('Tempo máximo atingido', HTTPResponseCode.informationBlocked);

    const uniqkey = Security.decrypt(data.edc, AuthData.buffer);
    if (!uniqkey)
      throw new AppProcessError(
        'Não foi possível realizar o login',
        HTTPResponseCode.informationNotTrue
      );

    const user = await UserService.getWith({ uniqkey });
    if (!uniqkey)
      throw new AppProcessError(
        'Não foi possível realizar o login',
        HTTPResponseCode.informationNotTrue
      );

    if (AuthActiveSessions.get(user.uniqkey)) {
      this.deleteLogin(user.uniqkey);
      throw new AppProcessError('Usuário derrubado', HTTPResponseCode.informationBlocked);
    }

    const token = (await this.signData({ user })) as string;

    if (!token)
      throw new AppProcessError(
        'Não foi possível criar uma assinatura segura',
        HTTPResponseCode.iternalErro
      );
    const session = Object.assign(user, { token });
    AuthActiveSessions.set(user.uniqkey, session);
    UserService.update(user.id, {
      loged_at: new Date(),
      auth_token: token
    });

    return {
      user,
      token
    };
  }

  static async login(data: RequestLogin) {
    const foundUser = await UserService.getWithFullData({ email: data.email });
    if (!foundUser)
      throw new AppProcessError('Email incorreto', HTTPResponseCode.informationNotTrue);

    if (!bcrypt.compareSync(data.pass, foundUser.pass))
      throw new AppProcessError('Senha incorreta', HTTPResponseCode.informationNotTrue);

    return this.createLogin(foundUser.uniqkey);
  }

  static async validate(data: UserAuthMiddlewareProps, token: string) {
    const user = await UserService.getWithFullData({
      email: data.email,
      uniqkey: data.uniqkey
    });
    const activeSession = AuthActiveSessions.get(user.uniqkey);
    if (!activeSession)
      throw new AppProcessError('Deslogado', HTTPResponseCode.informationUnauthorized);

    if (activeSession.token != token)
      throw new AppProcessError(
        'Token não é válido para esta sessão',
        HTTPResponseCode.informationUnauthorized
      );

    return {
      name: user.name,
      email: user.email,
      uniqkey: user.uniqkey,
      picture: user.picture,
      loged_at: user.loged_at,
      env_id: user.env_id,
      block_with_venc: user.block_with_venc,
      date_venc: user.date_venc,
      params: user.params,
      type: user.type
    };
  }

  static async validatePassword(user_id: string | number, password: string) {
    const user = await UserService.getWithFullData({ id: user_id });
    if (!user)
      throw new AppProcessError('Usuário não encontrado', HTTPResponseCode.informationNotTrue);

    if (!bcrypt.compareSync(password, user.pass))
      throw new AppProcessError('Senha incorreta', HTTPResponseCode.informationNotTrue);

    return true;
  }
}
